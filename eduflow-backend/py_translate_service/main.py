from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Union
import os
from google.cloud import translate_v3 as translate
from bs4 import BeautifulSoup

app = FastAPI(title='Translate v3 microservice')


class TranslateRequest(BaseModel):
    q: Optional[Union[str, List[str]]] = None
    html: Optional[str] = None
    target: str = 'en'
    source: Optional[str] = None


def translate_texts(contents: List[str], target: str, source: Optional[str], project_id: str):
    client = translate.TranslationServiceClient()
    location = 'global'
    parent = f'projects/{project_id}/locations/{location}'
    request = {
        'parent': parent,
        'contents': contents,
        'mime_type': 'text/plain',
        'target_language_code': target,
    }
    if source:
        request['source_language_code'] = source

    resp = client.translate_text(request=request)
    return [t.translated_text for t in resp.translations]


@app.post('/v1/translate')
async def translate_endpoint(req: TranslateRequest):
    project_id = os.environ.get('GCP_PROJECT_ID')
    if not project_id:
        raise HTTPException(status_code=500, detail='GCP_PROJECT_ID not configured in environment')

    try:
        if req.html:
            soup = BeautifulSoup(req.html, 'html.parser')
            # collect text nodes
            texts = []
            nodes = []

            for element in soup.find_all(text=True):
                # skip scripts/styles
                if element.parent.name in ['script', 'style', 'noscript']:
                    continue
                txt = element.string.strip() if element.string else ''
                if txt:
                    texts.append(txt)
                    nodes.append(element)

            if not texts:
                return {'html': req.html, 'translations': []}

            translated = translate_texts(texts, req.target, req.source, project_id)

            for node, t in zip(nodes, translated):
                node.replace_with(t)

            return {'html': str(soup), 'translations': translated}

        if req.q is None:
            raise HTTPException(status_code=400, detail='Missing q or html')

        contents = req.q if isinstance(req.q, list) else [req.q]
        translated = translate_texts(contents, req.target, req.source, project_id)
        return {'translations': translated}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='127.0.0.1', port=5001, reload=False)
