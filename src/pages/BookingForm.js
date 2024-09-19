import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { UserContext } from "../contexts/UserContext";
import "./pageStyles/booking.css";

const BookingForm = () => {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        photographyType: "",
        location: "",
        date: "",
        time: "",
        videoRecording: false,
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [available, setAvailable] = useState(null);
    const [price, setPrice] = useState(null);
    const [offer, setOffer] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentError, setPaymentError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [photographer, setPhotographer] = useState(null);
    const [videographer, setVideographer] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        if (currentStep === 1) {
            try {
                const response = await fetch('https://naprednebaze.somee.com/api/Bookings/CheckAvailability', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        photographyType: formData.photographyType,
                        location: formData.location,
                        dateTime: `${formData.date}T${formData.time}`,
                        videoRecording: formData.videoRecording,
                        user: {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                        }
                    }),
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error("Response not ok:", text);
                    throw new Error("Failed to fetch availability.");
                }

                const availabilityResponse = await response.json();

                if (availabilityResponse && availabilityResponse.available) {
                    setAvailable(true);
                    setPrice(availabilityResponse.price);
                    setOffer(availabilityResponse.offer);
                    setCurrentStep(2);
                } else {
                    setAvailable(false);
                }
            } catch (error) {
                console.error("There was an error:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parseFloat(paymentAmount) === price) {
            try {
                const bookingResponse = await fetch('https://naprednebaze.somee.com/api/Bookings/Create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        photographyType: formData.photographyType,
                        location: formData.location,
                        dateTime: `${formData.date}T${formData.time}`,
                        album: false, // Postavite na `true` ako je album uključen
                        videoRecording: formData.videoRecording,
                        user: {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                        },
                    }),
                });
    
                if (!bookingResponse.ok) {
                    const text = await bookingResponse.text();
                    console.error("Response not ok:", text);
                    console.log(formData.photographyType); // Proveri da li se šal
                    throw new Error("Failed to create booking.");
                }
    
                const bookingData = await bookingResponse.json();
    
                setPhotographer(bookingData.photographer);
                setVideographer(bookingData.videographer);
    
                const confirmResponse = await fetch('https://naprednebaze.somee.com/api/Bookings/Confirm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        bookingId: bookingData.booking.id,
                        advancePaymentAmount: price,
                    }),
                });
    
                if (confirmResponse.ok) {
                    setSuccess(true);
                    setPaymentError(null);
                } else {
                    setPaymentError("Failed to confirm the booking.");
                }
            } catch (error) {
                console.error("There was an error:", error);
                setPaymentError("An error occurred. Please try again.");
            }
        } else {
            setPaymentError("Payment amount does not match the required price.");
        }
    };

    const handleBackToGallery = () => {
        navigate('/gallery'); // Preusmeravanje na stranicu /gallery
    };

    return (
        <div className="booking-container">
            <h2>Book a Photography Session</h2>

            {currentStep === 1 && (
                <form onSubmit={handleNextStep} className="booking-form">
                    <div className="form-group">
                        <label>Photography Type:</label>
                        <select
                            name="photographyType"
                            value={formData.photographyType}
                            onChange={handleChange}
                        >
                            <option value="private">Private</option>
                            <option value="graduation">Graduation</option>
                            <option value="wedding">Wedding</option>
                            <option value="event">Event</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Time:</label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="videoRecording"
                                checked={formData.videoRecording}
                                onChange={handleChange}
                            />
                            Include Video Recording
                        </label>
                    </div>

                    <button type="submit">Next</button>

                    {available === false && (
                        <div className="booking-response">
                            <p style={{ color: "red" }}>Sorry, the term is not available.</p>
                        </div>
                    )}
                </form>
            )}

            {currentStep === 2 && available && (
                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="checkout">
                        <p><strong>Price:</strong> {price} credits</p>
                        {offer && (
                            <div className="offer-details">
                                <p><strong>Offer:</strong> {offer}</p>
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label>Enter Amount:</label>
                            <input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                placeholder="Enter amount"
                                required
                            />
                        </div>
                    </div>

                    {paymentError && <div className="payment-error">{paymentError}</div>}
                    {success && (
                        <div className="payment-success">
                            Payment successful! Your booking is confirmed.
                            {photographer && (
                                <div className="employee-info">
                                    <h3>Assigned Photographer:</h3>
                                    <p><strong>Name:</strong> {photographer.firstName} {photographer.lastName}</p>
                                </div>
                            )}
                            {videographer && (
                                <div className="employee-info">
                                    <h3>Assigned Videographer:</h3>
                                    <p><strong>Name:</strong> {videographer.firstName} {videographer.lastName}</p>
                                </div>
                            )}
                            <button onClick={handleBackToGallery} className="back-button">
                                Back to Gallery
                            </button>
                        </div>
                    )}
                    <div className="buttons">
                        <button onClick={() => setCurrentStep(1)} type="button">
                            Back
                        </button>
                        <button type="submit">
                            Confirm
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BookingForm;
