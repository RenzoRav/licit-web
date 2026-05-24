import { defineStore } from 'pinia'
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@/firebase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    userEmail: (state) => state.user?.email || '',
  },

  actions: {
    async loginWithGoogle() {
      this.loading = true
      this.error = null
      try {
        const result = await signInWithPopup(auth, googleProvider)
        this.user = result.user
        this.token = await result.user.getIdToken()
        localStorage.setItem('token', this.token)
        return true
      } catch (err) {
        this.error = err.message
        return false
      } finally {
        this.loading = false
      }
    },

    async loginWithEmail(email, password) {
      this.loading = true
      this.error = null
      try {
        const result = await signInWithEmailAndPassword(auth, email, password)
        this.user = result.user
        this.token = await result.user.getIdToken()
        localStorage.setItem('token', this.token)
        return true
      } catch (err) {
        this.error = err.message
        return false
      } finally {
        this.loading = false
      }
    },

    async registerWithEmail(email, password) {
      this.loading = true
      this.error = null
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        this.user = result.user
        this.token = await result.user.getIdToken()
        localStorage.setItem('token', this.token)
        return true
      } catch (err) {
        this.error = err.message
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      await signOut(auth)
      localStorage.removeItem('token')
      this.user = null
      this.token = null
      this.error = null
    },

    init() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.user = user
          this.token = await user.getIdToken()
          localStorage.setItem('token', this.token)
        } else {
          this.user = null
          this.token = null
          localStorage.removeItem('token')
        }
      })
    },
  },
})
