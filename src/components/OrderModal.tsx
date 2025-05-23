import React, { useState } from 'react';
import '../OrderModal.css';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPlaceOrder: (customerData: CustomerData) => void;
    totalPrice: number;
}

interface CustomerData {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onPlaceOrder, totalPrice }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const customerData: CustomerData = {
            firstName,
            lastName,
            address,
            phone,
            email,
        };
        onPlaceOrder(customerData);
        onClose();
        setFirstName('');
        setLastName('');
        setAddress('');
        setPhone('');
        setEmail('');
    };

    return (
        <div className="order-modal-overlay">
            <div className="order-modal-content">
                <h2>Place Your Order</h2>
                <p>Total: {totalPrice.toFixed(2)} rsd</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number:</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="place-order-button">Place Order</button>
                        <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderModal;