// Mock Firebase exports for local development
export const auth = {
  currentUser: null
};

export const db = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: true, data: () => ({}) }),
      set: () => Promise.resolve()
    })
  })
};

export default {
  // Mock Firebase app
}; 