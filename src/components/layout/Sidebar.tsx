"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { clsx } from "clsx"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"
import sumarLogo from "../../../public/images/menuimg.png";
// Iconos
import { Home, Users, UserPlus, Settings, LogOut, Menu, X, FileText, User, Database } from "react-feather"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  title: string
  active?: boolean
  onClick?: () => void
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, title, active, onClick }) => {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-md transition-colors",
        active
          ? "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-100"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
      )}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      {title}
    </Link>
  )
}

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user, logout, hasRole } = useAuth()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`)
  }

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="fixed top-0 left-0 z-40 flex items-center p-4 md:hidden">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out md:translate-x-0 border-r border-gray-200 dark:border-gray-800",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex bg-brand-500 items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
            <div className="relative h-10 w-32">
            <Image src={sumarLogo} alt="SUMAR Logo" width={100} height={100} style={{ objectFit: "contain" }} />

            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <NavItem
              href="/dashboard"
              icon={<Home size={20} />}
              title="Dashboard"
              active={isActive("/dashboard")}
              onClick={() => setIsOpen(false)}
            />

            {/* Sección de Administrador - Cambiado de ADMIN a admin */}
            {hasRole("admin") && (
              <>
                <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  Administración
                </h3>
                <NavItem
                  href="/admin/users"
                  icon={<Users size={20} />}
                  title="Usuarios"
                  active={isActive("/admin/users")}
                  onClick={() => setIsOpen(false)}
                />
               
                <NavItem
                  href="/admin/efectores"
                  icon={<Database size={20} />}
                  title="Efectores"
                  active={isActive("/admin/efectores")}
                  onClick={() => setIsOpen(false)}
                />
              </>
            )}

            {/* Sección de Usuario - Cambiado de USER a user */}
            {(hasRole("user") || hasRole("admin")) && (
              <>
                <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  Beneficiarios
                </h3>
                <NavItem
                  href="/beneficiarios"
                  icon={<Users size={20} />}
                  title="Listado"
                  active={isActive("/beneficiarios") && !isActive("/beneficiarios/nuevo")}
                  onClick={() => setIsOpen(false)}
                />
              </>
            )}

            {/* Sección de Manager - Cambiado de MANAGER a manager */}
            {( hasRole("admin")) && (
              <>
                <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  Gestión
                </h3>
                <NavItem
                  href="/manager/archivos"
                  icon={<Database size={20} />}
                  title="Generar Archivo A"
                  active={isActive("/manager/archivos")}
                  onClick={() => setIsOpen(false)}
                />
              </>
            )}

            {/* Perfil y Configuración */}
            <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Cuenta</h3>
            <NavItem
              href="/perfil"
              icon={<User size={20} />}
              title="Mi Perfil"
              active={isActive("/perfil")}
              onClick={() => setIsOpen(false)}
            />
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <LogOut size={20} className="mr-3" />
              Cerrar Sesión
            </button>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.roles.map((role) => role.name).join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
