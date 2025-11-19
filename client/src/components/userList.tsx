import React, { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/users")
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    return (
        <>
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