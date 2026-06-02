import React from 'react'

function stripMotionProps(props) {
  const {
    whileHover,
    whileTap,
    initial,
    animate,
    exit,
    transition,
    ...safeProps
  } = props || {}
  return safeProps
}

// Lightweight DOM fallbacks for animation wrappers.
export function LazyMotionDiv(props) {
  return React.createElement('div', stripMotionProps(props), props.children)
}

export function LazyMotionButton(props) {
  return React.createElement('button', stripMotionProps(props), props.children)
}

export function LazyAnimatePresence({ children }) {
  return React.createElement(React.Fragment, null, children)
}

export default null
