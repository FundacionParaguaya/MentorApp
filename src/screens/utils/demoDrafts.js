const demoDrafts = [
  { id: 19, title: 'Stoplight Demo - Spanish' },
  { id: 20, title: 'Stoplight Demo - English' },
  { id: 22, title: 'UK - SHORT DEMO' }
]

export const isDemoDraft = ({ id, title }) =>
  demoDrafts.some(draft => draft.id === id && draft.title === title)
