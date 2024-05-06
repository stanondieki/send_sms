import { useState, useEffect } from 'react';
import styles from '../styles/utils.module.css';

interface User {
    id: string;
    name: string;
    phoneNumber: string;
}

const SendMessagePage = () => {
    const [recipients, setRecipients] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Modified line

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data: User[] = await response.json();
                setUsers(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!message) {
            alert('Please enter a message.');
            return;
        }

        if (recipients.length === 0) {
            alert('Please select at least one recipient.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/send-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to: recipients, message }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            alert(data.message || data.error);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.send_container}>
            <h1>Send Message</h1>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Recipients:
                    <select
                        className={styles.recp}
                        value={recipients}
                        onChange={(e) => setRecipients(Array.from(e.target.selectedOptions, option => option.value))}
                        multiple
                    >
                        {users.map((user: User) => (
                            <option key={user.id} value={user.phoneNumber}>
                                {user.name} ({user.phoneNumber})
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Message:
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
                </label>
                <br />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default SendMessagePage;
