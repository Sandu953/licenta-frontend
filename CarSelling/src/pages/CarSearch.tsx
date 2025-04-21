import React, {useEffect, useState} from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonCard,
    IonCardContent,
    IonLabel, IonRouterLink,
} from "@ionic/react";
import { personOutline } from "ionicons/icons";
import "./CarSearch.css";

const CarSearch: React.FC = () => {
    const [filters, setFilters] = useState({ search: "", brand: "", year: "" });

    const [maxWidth, setMaxWidth] = useState("1400px");

    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

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




    const carListings = [
        { id: 1, brand: "BMW", model: "5 Series", price: "45,000", year: 2020, km: "123,456 KM", fuel: "Petrol", src: "/car1.jpg", parked: true },
        { id: 2, brand: "Audi", model: "A6", price: "42,000", year: 2019, km: "98,000 KM", fuel: "Diesel", src: "/car2.jpg", parked: false },
        { id: 3, brand: "Mercedes", model: "C-Class", price: "50,000", year: 2021, km: "75,000 KM", fuel: "Hybrid", src: "/car3.jpg", parked: false },
        { id: 4, brand: "Tesla", model: "Model 3", price: "20,000", year: 2021, km: "100,000 KM", fuel: "Electric", src: "/car4.jpg", parked: false },
        { id: 5, brand: "Ford", model: "Mustang", price: "60,000", year: 2020, km: "7,000 KM", fuel: "Petrol", src: "/car5.jpg", parked: false },
        { id: 6, brand: "Porsche", model: "911", price: "100,000", year: 2024, km: "5,000 KM", fuel: "Hybrid", src: "/car6.jpg", parked: false },
        { id: 7, brand: "Ferrari", model: "812", price: "500,000", year: 2023, km: "2,000 KM", fuel: "Petrol", src: "/car7.jpg", parked: false },
        { id: 8, brand: "Audi", model: "R8", price: "120,000", year: 2021, km: "7,000 KM", fuel: "Petrol", src: "/car8.jpg", parked: false },
    ];

    // State to track parked cars
    const [cars, setCars] = useState(carListings);

    // Function to toggle parked state
    const togglePark = (id: number) => {
        setCars((prevCars) =>
            prevCars.map((car) =>
                car.id === id ? { ...car, parked: !car.parked } : car
            )
        );
    };

    return (
        <IonPage>
            {/* Navigation Bar */}
            <IonHeader style={{ paddingTop : "1.5px" }}>
                <IonToolbar style={{ maxWidth, margin: "0 auto", "--background": isDarkMode ? "#121212" : "#fff" }}>
                    <IonButtons slot="start">
                        <IonButton routerLink="/" fill="clear" style={{"--color-hover": "#4ad493"}}>
                            {/*<IonTitle>LOGO</IonTitle>*/}
                            <img src="/logo-placeholder.png" alt="Logo" style={{ height: "40px" }} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="primary" style={{ display: "flex", gap: "15px" }}>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493"}}>
                            Parked
                        </IonButton>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493"}}>
                            Car Advisor
                        </IonButton>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493"}}>
                            Sell a Car
                        </IonButton>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493"}}>
                            Auctions
                        </IonButton>
                        <IonButton routerLink="/" style={{ backgroundColor: "#4ad493", color: "#121212", borderRadius: "50px"}}>
                            <IonIcon slot="icon-only" icon={personOutline}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            {/* Search Filters */}
            <IonContent fullscreen>
                <div style={{maxWidth, margin: "0 auto", padding: "16px" }}>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" size-md="3">
                                <IonInput placeholder="Search by Model" value={filters.search} />
                            </IonCol>
                            <IonCol size="12" size-md="3">
                                <IonInput placeholder="Search by Brand" value={filters.brand} />
                            </IonCol>
                            <IonCol size="12" size-md="3">
                                <IonInput placeholder="Search by Year" type="number" value={filters.year} />
                            </IonCol>
                            <IonCol size="12" size-md="3">
                                <IonButton expand="block">More Advanced Filters</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonGrid>
                        {cars.map((car) => (
                            <IonRouterLink routerLink="/car-detail">
                                <IonCard className="hover-expand-search" key={car.id} style={{ display: "flex", "--flex-direction": "row" ,padding: "12px", minHeight: "200px" }}>
                                    {/* Wrap the Image and Title in a Link */}
                                    <img
                                        src={car.src}
                                        alt={`${car.brand} ${car.model}`}
                                        style={{ width: "325px", height: "195px", objectFit: "cover"}}
                                    />
                                    <IonCardContent>
                                        <IonLabel style={{ flexGrow: 1 }}>
                                            <h1>{car.brand}, {car.model}</h1>
                                            <p>{car.km} | {car.fuel} | {car.year}</p>
                                        </IonLabel>
                                        <IonButton
                                            fill="clear"
                                            onClick={(e) => {
                                                e.preventDefault();  // Prevents the default navigation behavior
                                                e.stopPropagation(); // Prevent navigation
                                                // Place your custom functionality here
                                                console.log("Private Seller button clicked");
                                            }}
                                            style={{
                                            position: "absolute",
                                            bottom: "10px",
                                            left: "10px"
                                        }}>
                                            <IonIcon icon={personOutline} />
                                            Private Seller
                                        </IonButton>
                                    </IonCardContent>

                                    <span style={{
                                        position: "absolute",
                                        top: "20px",
                                        right: "20px",
                                        fontSize: "1.32rem",
                                        fontWeight: "bold",
                                        backgroundColor: "#4ad493",
                                        color: "#121212",
                                        padding: "5px 10px",
                                        borderRadius: "8px"
                                    }}
                                    >
                                    {car.price} EUR
                                </span>

                                    <IonButton
                                        fill="clear"
                                        onClick={(e) => {
                                            e.preventDefault();  // Prevents the default navigation behavior
                                            e.stopPropagation(); // Prevents click from navigating
                                            togglePark(car.id);
                                        }}
                                        style={{
                                            position: "absolute",
                                            bottom: "10px",
                                            right: "20px",
                                            width: "60px",
                                            height: "60px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: "1px",
                                            overflow: "hidden", // Prevents unwanted shifts
                                            "--border-radius": "50%",
                                            "--background": car.parked ? "#4ad493" : "default",
                                            "--color": car.parked ? "#121212" : "#1f1f1f",

                                        }}
                                    >
                                        <IonIcon
                                            slot="icon-only"
                                            src = {"/park-icon-dark.svg"}
                                            style={{
                                                width: "41px",
                                                height: "41px",
                                                marginLeft: "3.5px", // Adjust left/right margin manually if needed
                                                marginTop: "2px", // Adjust top/bottom margin manually if needed
                                            }}
                                        >
                                        </IonIcon>
                                    </IonButton>
                                </IonCard>

                            </IonRouterLink>

                        ))}
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default CarSearch;
