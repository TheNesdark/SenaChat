import React, { useState, useEffect } from 'react';

export default function UserList() {
    const [users, setUsers] = useState<any[]>([]);

    const handleNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Verificar que el formulario exista
        if (!e.currentTarget) {
            console.error("No se puede acceder al formulario");
            return;
        }
        
        // Crear un objeto FormData para obtener los valores
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
            
            if (response.ok) {
                // Si el usuario se creó correctamente, recargar la lista
                const newUser = await response.json();
                setUsers(prevUsers => [...prevUsers, newUser]);
                
                // Limpiar el formulario solo si aún existe
                if (e.currentTarget && typeof e.currentTarget.reset === 'function') {
                    e.currentTarget.reset();
                }
            } else {
                console.error("Error al crear usuario:", response.statusText);
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    }
    
    useEffect(() => {
        fetch("http://localhost:3000/users")
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    return (
        <>
            <form onSubmit={handleNewUser}>
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" name="name" placeholder="Ingrese su nombre" required />
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Ingrese su email" required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Ingrese su contraseña" required />
                <button type="submit">Registrar</button>
            </form>
            <div>User List</div>
            {users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.name} - {user.email}</li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </>
    );
}