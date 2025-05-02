"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { X } from "react-feather"
import { clsx } from "clsx"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: ToastType = "info", duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose()
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, onClose])

  return (
    <div
      className={clsx("flex items-center justify-between p-4 rounded-md shadow-md min-w-[300px] max-w-md", {
        "bg-green-100 text-green-800": toast.type === "success",
        "bg-red-100 text-red-800": toast.type === "error",
        "bg-blue-100 text-blue-800": toast.type === "info",
        "bg-yellow-100 text-yellow-800": toast.type === "warning",
      })}
    >
      <p>{toast.message}</p>
      <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none">
        <X size={18} />
      </button>
    </div>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
