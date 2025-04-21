import React, { useEffect, useState } from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonImg,
    IonIcon
} from "@ionic/react";
import { personOutline } from "ionicons/icons";

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore from "swiper";
import {Pagination} from "swiper/modules";
import {Navigation} from "swiper/modules";

// Install Swiper modules
SwiperCore.use([Pagination,Navigation]);

const CarDetail: React.FC = () => {
    const [maxWidth, setMaxWidth] = useState("1400px");
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Dynamically set arrow background and color
    const arrowBackground = isDarkMode ? "#333" : "#fff";
    const arrowColor = isDarkMode ? "#fff" : "#121212";

    useEffect(() => {
        // Listen for dark mode changes dynamically
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent) => setIsDarkMode(event.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const updateMaxWidth = () => {
        if (window.innerWidth > 1800) {
            setMaxWidth("1600px");
        } else if (window.innerWidth > 1400) {
            setMaxWidth("1400px");
        } else if (window.innerWidth > 1200) {
            setMaxWidth("1200px");
        } else {
            setMaxWidth("100%");
        }
    };

    useEffect(() => {
        updateMaxWidth();
        window.addEventListener("resize", updateMaxWidth);
        return () => window.removeEventListener("resize", updateMaxWidth);
    }, []);

    const car = {
        brand: "BMW",
        model: "5 Series",
        price: "45,000 EUR",
        km: "123,456 KM",
        hp: "717 HP",
        engine: "4.4L Bi-Turbo",
        year: 2024,
        location: "Berlin, Germany",
        rating: "⭐⭐⭐⭐⭐",
        seller: "Private Seller",
        description: "This is a well-maintained BMW 5 Series with full service history. No accidents, first owner.",
        features: ["Leather Seats", "Navigation", "Parking Sensors", "Bluetooth"]
    };

    // Array of car images for the slider
    const carImages = ["/5series-1.jpg", "/5series-2.jpg", "/5series-3.jpg", "/5series-4.jpg"];

    return (
        <IonPage>
            {/* Header */}
            <IonHeader style={{ paddingTop: "1.5px" }}>
                <IonToolbar style={{ maxWidth, margin: "0 auto", "--background": isDarkMode ? "#121212" : "#fff" }}>
                    <IonButtons slot="start">
                        <IonButton routerLink="/" fill="clear" style={{ "--color-hover": "#4ad493" }}>
                            <img src="/logo-placeholder.png" alt="Logo" style={{ height: "40px" }} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="primary" style={{ display: "flex", gap: "15px" }}>
                        <IonButton routerLink="/" style={{ "--color-hover": "#4ad493" }}>
                            Parked
                        </IonButton>
                        <IonButton routerLink="/" style={{ "--color-hover": "#4ad493" }}>
                            Car Advisor
                        </IonButton>
                        <IonButton routerLink="/" style={{ "--color-hover": "#4ad493" }}>
                            Sell a Car
                        </IonButton>
                        <IonButton routerLink="/" style={{ "--color-hover": "#4ad493" }}>
                            Auctions
                        </IonButton>
                        <IonButton routerLink="/" style={{ backgroundColor: "#4ad493", color: "#121212", borderRadius: "50px" }}>
                            <IonIcon slot="icon-only" icon={personOutline}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            {/* Content */}
            <IonContent fullscreen>
                <style>
                    {`
            /* Make the arrows circular and use dynamic background/color */
            .swiper-button-prev, .swiper-button-next {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              --swiper-navigation-size: 20px; /* size of arrow icon */
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              background-color: ${arrowBackground} !important;
              color: ${arrowColor} !important;
            }
            
            .swiper-button-prev {
                left: 20px !important;
            }
                
            .swiper-button-next {
                right: 20px !important;
            }

            /* Customize pagination bullets */
            .swiper-pagination-bullet {
              background: #4ad493 !important; /* default bullet color */
              opacity: 0.6;
            }
            .swiper-pagination-bullet-active {
              background: #4ad493 !important; /* active bullet color */
              opacity: 1;
            }
          `}
                </style>
                <div style={{ maxWidth, margin: "0 auto", padding: "16px" }}>
                    <IonGrid>
                        <IonRow>
                            {/* Car Images Section using Swiper.js */}
                            <IonCol size="8">
                                <Swiper
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    navigation={true}
                                    initialSlide={0}
                                    speed={400}
                                >
                                    {carImages.map((src, index) => (
                                        <SwiperSlide key={index}>
                                            <IonCard>
                                                <IonImg src={src} alt={`Car Image ${index + 1}`} style={{
                                                    width: "100%",
                                                    height: "600px", // standard height
                                                    objectFit: "cover" // crop or scale to maintain aspect ratio
                                                }}/>
                                            </IonCard>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </IonCol>

                            {/* Car Details (Right Side) */}
                            <IonCol size="4">
                                <h1>{car.brand}, {car.model}</h1>
                                <h2 style={{ color: "#4ad493" }}>{car.price}</h2>

                                <IonCard>
                                    <IonCardContent>
                                        <p><strong>Seller:</strong> {car.seller}</p>
                                        <p><strong>Location:</strong> {car.location}</p>
                                        <p><strong>Rating:</strong> {car.rating}</p>
                                        <IonButton expand="block">Message</IonButton>
                                        <IonButton expand="block" color="success">Call</IonButton>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>

                        {/* Basic Car Information */}
                        <IonRow>
                            <IonCol size="12">
                                <IonCard>
                                    <IonCardContent>
                                        <h3>Basic Information</h3>
                                        <p>{car.km} | {car.hp} | {car.engine} | {car.year}</p>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>

                        {/* Seller Description */}
                        <IonRow>
                            <IonCol size="12">
                                <IonCard>
                                    <IonCardContent>
                                        <h3>Seller Description</h3>
                                        <p>{car.description}</p>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>

                        {/* Technical Details */}
                        <IonRow>
                            <IonCol size="12">
                                <IonCard>
                                    <IonCardContent>
                                        <h3>Technical Details</h3>
                                        <ul>
                                            {car.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default CarDetail;
