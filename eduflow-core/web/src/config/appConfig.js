export const appConfig = {
  supportNumber: '9010150809',
  salesNumber: '9010150809',
  subscriptionNumber: '9010150809',
  whatsappNumber: '9010150809',
  
  getWhatsAppLink: (message = 'Hello, I need assistance.') => {
    return `https://wa.me/919010150809?text=${encodeURIComponent(message)}`
  },
  
  getSubscriptionMessage: (plan, institution) => {
    return `Hello,\n\nI would like to subscribe to EduFlow AI OS.\n\nPlan: ${plan}\nInstitution: ${institution}\n\nPlease assist me.`
  }
}
