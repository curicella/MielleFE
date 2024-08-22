import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { checkAvailability, createPaymentIntent } from "../services/Services";
import "./pageStyles/booking.css";

const BookingForm = () => {
    const [formData, setFormData] = useState({
        photographyType: "",
        location: "",
        date: "",
        time: "",
        album: false,
        videoRecording: false,
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [available, setAvailable] = useState(null);
    const [price, setPrice] = useState(null);
    const [paymentError, setPaymentError] = useState(null);
    const [success, setSuccess] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

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
                const availabilityResponse = await checkAvailability(formData);
                if (availabilityResponse.available) {
                    setAvailable(true);
                    setPrice(availabilityResponse.price);
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
        try {
            const paymentResponse = await createPaymentIntent(price);
            const { clientSecret } = paymentResponse;

            if (stripe && elements) {
                const { error, paymentIntent } = await stripe.confirmCardPayment(
                    clientSecret,
                    {
                        payment_method: {
                            card: elements.getElement(CardElement),
                        },
                    }
                );

                if (error) {
                    setPaymentError(error.message);
                    setSuccess(false);
                } else if (paymentIntent && paymentIntent.status === "succeeded") {
                    setSuccess(true);
                    setPaymentError(null);
                }
            }
        } catch (error) {
            console.error("There was an error:", error);
            setPaymentError("An error occurred. Please try again.");
        }
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

                    <div className="form-group" id="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="album"
                                checked={formData.album}
                                onChange={handleChange}
                            />
                            Add Album
                        </label>
                    </div>

                    <div className="form-group" id="checkbox">
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
                        <p>Price: {price} credits</p>
                        <label>Card Details:</label>
                        <CardElement />
                    </div>

                    {paymentError && <div className="payment-error">{paymentError}</div>}
                    {success && (
                        <div className="payment-success">
                            Payment successful! Your booking is confirmed.
                        </div>
                    )}
                    <div className="buttons">
                        <button onClick={() => setCurrentStep(1)} type="button">
                            Back
                        </button>
                        <button type="submit" disabled={!stripe || !elements}>
                            Pay & Confirm
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BookingForm;
