# Componentes de Feedback Visual - Guía de Uso

## 📋 Componentes Disponibles

### 1. **Spinner** - Indicador de carga
Componente de carga con múltiples variantes.

```tsx
import { Spinner, LoadingState } from "@/components/ui/spinner"

// Simple spinner
<Spinner />
<Spinner size="sm" variant="accent" />
<Spinner size="lg" />

// Con estado de carga
<LoadingState 
  isLoading={isLoading} 
  loadingText="Procesando..."
  spinnerSize="md"
>
  <YourContent />
</LoadingState>

// Pantalla completa
<LoadingState 
  isLoading={isLoading}
  fullScreen
  loadingText="Cargando datos..."
>
  {/* No se muestra mientras carga */}
</LoadingState>
```

### 2. **Toasts Mejorados** - Notificaciones
Sistema de notificaciones con variantes de color.

```tsx
import { useEnhancedToast } from "@/hooks/use-enhanced-toast"

export function MyComponent() {
  const toast = useEnhancedToast()

  return (
    <>
      <button onClick={() => toast.success({ 
        title: "¡Éxito!", 
        description: "La operación se completó" 
      })}>
        Success
      </button>
      
      <button onClick={() => toast.error({ 
        title: "Error", 
        description: "Algo salió mal" 
      })}>
        Error
      </button>

      <button onClick={() => toast.warning({ 
        title: "Advertencia", 
        description: "Revisa esto" 
      })}>
        Warning
      </button>

      <button onClick={() => toast.info({ 
        title: "Información", 
        description: "Nota importante" 
      })}>
        Info
      </button>
    </>
  )
}
```

**Variantes disponibles:**
- `success` - Verde ✅
- `error` - Rojo ❌
- `warning` - Amarillo ⚠️
- `info` - Azul ℹ️
- `default` - Neutral

### 3. **LoadingButton** - Botón con estado de carga
Botón que muestra spinner automáticamente durante acciones.

```tsx
import { LoadingButton } from "@/components/ui/loading-button"
import { useFormState } from "@/hooks/use-form-state"

export function LoginForm() {
  const { isLoading, error, execute } = useFormState({
    onSuccess: () => console.log("Login exitoso"),
    onError: (err) => console.error("Error:", err)
  })

  const handleLogin = async () => {
    await execute(async () => {
      const response = await fetch("/api/login")
      return response.json()
    })
  }

  return (
    <>
      <LoadingButton 
        onClick={handleLogin}
        isLoading={isLoading}
        loadingText="Iniciando sesión..."
      >
        Ingresar
      </LoadingButton>
      {error && <p className="text-red-500">{error.message}</p>}
    </>
  )
}
```

### 4. **useFormState** - Hook de manejo de estado
Simplifica el manejo de estados en formularios y acciones asincrónicas.

```tsx
import { useFormState } from "@/hooks/use-form-state"
import { useEnhancedToast } from "@/hooks/use-enhanced-toast"

export function CreateUserForm() {
  const { isLoading, error, execute } = useFormState({
    onSuccess: () => {
      toast.success({ 
        title: "Usuario creado", 
        description: "El usuario fue creado exitosamente" 
      })
    },
    onError: (error) => {
      toast.error({ 
        title: "Error", 
        description: error.message 
      })
    }
  })
  const toast = useEnhancedToast()

  const onSubmit = async (data: UserData) => {
    await execute(async () => {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error("Error al crear usuario")
      return response.json()
    })
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      onSubmit(new FormData(e.currentTarget) as any)
    }}>
      {/* Form fields */}
      <LoadingButton isLoading={isLoading} type="submit">
        Crear Usuario
      </LoadingButton>
    </form>
  )
}
```

### 5. **Transition & TransitionGroup** - Animaciones suaves
Componentes para agregar transiciones visuales.

```tsx
import { Transition, TransitionGroup } from "@/components/ui/transition"

// Transición individual
<Transition type="fade" duration="normal">
  <div>Contenido con fade-in</div>
</Transition>

// Con slide
<Transition type="slide" duration="slow" delay={100}>
  <div>Aparece con slide desde abajo</div>
</Transition>

// Grupo de transiciones escalonadas
<TransitionGroup staggerDelay={150} type="slide">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</TransitionGroup>

// En listas
<TransitionGroup>
  {items.map((item) => (
    <div key={item.id}>{item.name}</div>
  ))}
</TransitionGroup>
```

---

## 🎯 Casos de Uso Comunes

### Formulario con validación
```tsx
export function UserForm() {
  const { isLoading, error, execute } = useFormState()
  const toast = useEnhancedToast()

  const handleSubmit = async (formData: FormData) => {
    const result = await execute(async () => {
      const response = await fetch("/api/user", { 
        method: "POST", 
        body: formData 
      })
      if (!response.ok) throw new Error("Error en la solicitud")
      return response.json()
    })

    if (result) {
      toast.success({ 
        title: "Guardado", 
        description: "Los datos fueron guardados" 
      })
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit(new FormData(e.currentTarget))
    }}>
      <input name="email" type="email" required />
      {error && <LoadingState isLoading={true}>{error.message}</LoadingState>}
      <LoadingButton type="submit" isLoading={isLoading}>
        Guardar
      </LoadingButton>
    </form>
  )
}
```

### Eliminación con confirmación
```tsx
const handleDelete = async (id: string) => {
  await execute(async () => {
    const response = await fetch(`/api/items/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("No se pudo eliminar")
    return response.json()
  })
}
```

---

## 📦 Instalación de Dependencias
Todos los componentes usan dependencias ya instaladas:
- `lucide-react` - Iconos
- `@radix-ui/react-toast` - Base de toasts
- `class-variance-authority` - Variantes de estilos
- `tailwindcss` - Estilos

No requieren instalación adicional. ✅
