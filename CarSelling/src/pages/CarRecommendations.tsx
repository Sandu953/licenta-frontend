import React, {useEffect, useRef, useState} from "react";
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
    IonLabel, IonRouterLink, IonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonCheckbox,
    IonRadio,
    IonSpinner,
    IonAccordion,
    IonBackButton,
    IonSelect,
    IonToggle,
    IonTabBar,
    IonTabButton, IonRouterOutlet,
    IonTabs, IonFooter
} from "@ionic/react";
import { personOutline } from "ionicons/icons";
import {carSportOutline, cashOutline, homeOutline, sparklesOutline} from 'ionicons/icons';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import {Redirect, Route, useHistory} from "react-router-dom";

const CarRecommendations: React.FC = () => {
    const [cars, setCars] = useState<AuctionPreview[]>([]);

    const [maxWidth, setMaxWidth] = useState("1400px");

    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

    const [loading, setLoading] = useState(true);

    const [favoriteAuctionIds, setFavoriteAuctionIds] = useState<number[]>([]);
    const userId = parseInt(localStorage.getItem("userId") || "0");
    const isLoggedIn = userId > 0;

    function useIsMobile(breakpoint = 550) {
        const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

        useEffect(() => {
            const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, [breakpoint]);

        return isMobile;
    }

    const isMobile = useIsMobile();

    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const favRes = await axios.get<number[]>(`http://localhost:5000/api/favorites/list/${userId}`);
                const favorites = favRes.data;
                setFavoriteAuctionIds(favorites);

                const recRes = await axios.get<AuctionPreview[]>(`http://localhost:5000/Recommendation/${userId}`);
                const enriched = recRes.data.map(car => ({
                    ...car,
                    isFavorite: favorites.includes(car.id)
                }));

                setCars(enriched);
            } catch (err) {
                console.error("Error loading recommendations or favorites:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleFavorite = async (auctionId: number, currentState: boolean) => {
        try {
            if (currentState) {
                await axios.delete(`http://localhost:5000/api/favorites/remove`, {
                    data: { userId, auctionId }
                });
            } else {
                await axios.post(`http://localhost:5000/api/favorites/add`, { userId, auctionId });
            }

            const updatedFavorites = await axios.get<number[]>(`http://localhost:5000/api/favorites/list/${userId}`);
            setFavoriteAuctionIds(updatedFavorites.data);

            setCars(prev =>
                prev.map(car => ({
                    ...car,
                    isFavorite: updatedFavorites.data.includes(car.id)
                }))
            );
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
        }
    };


    interface AuctionPreview {
        id : number;
        title: string;
        make: string;
        model: string;
        location: string;
        year: number;
        mileage: number;
        currentBid: number;
        startTime: string;
        imageUrl: string;
        isFavorite: boolean;
        ownerUserName : string;
        ownerPfp : string;
    }


    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get<AuctionPreview[]>(`http://localhost:5000/Recommendation/${localStorage.getItem("userId")}`);
                setCars(response.data);
            } catch (error) {
                console.error("Error fetching car recommendations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);


    const CountdownTimer = ({ startTime }: { startTime: string }) => {
        const getEndTime = (startTime: string) => {
            const start = new Date(startTime);
            const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
            return end;
        };

        const calculateTimeLeft = () => {
            const difference = +getEndTime(startTime) - +new Date();
            return difference > 0 ? {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            } : null;
        };

        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

        useEffect(() => {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);
            return () => clearInterval(timer);
        }, [startTime]);

        if (!timeLeft) return <span className="text-red-600">Auction ended</span>;

        return (
            <span>
                {timeLeft.days}d {timeLeft.hours.toString().padStart(2, '0')}:
                {timeLeft.minutes.toString().padStart(2, '0')}:
                {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
        );
    };

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


    return (
        <IonPage>
            {!isMobile && (
                <IonHeader style={{ paddingTop : "1.5px" }}>
                    <IonToolbar style={{ maxWidth, margin: "0 auto", "--background": isDarkMode ? "#121212" : "#fff" }}>
                        <IonButtons slot="start">
                            <IonButton routerLink="/" fill="clear" style={{"--color-hover": "#4ad493"}}>
                                {/*<IonTitle>LOGO</IonTitle>*/}
                                <img src="/logo-placeholder.png" alt="Logo" style={{ height: "40px" }} />
                            </IonButton>
                        </IonButtons>
                        <IonButtons slot="primary" style={{ display: "flex", gap: "15px" }}>
                            <IonButton routerLink="/car-favorites" style={{"--color-hover": "#4ad493"}}>
                                Parked
                            </IonButton>
                            <IonButton routerLink="/car-recommendations" style={{"--color-hover": "#4ad493"}}>
                                Recommendations
                            </IonButton>
                            <IonButton routerLink="/sell-car" style={{"--color-hover": "#4ad493"}}>
                                Sell a Car
                            </IonButton>
                            <IonButton routerLink="/auth" style={{ backgroundColor: "#4ad493", color: "#121212", borderRadius: "50px"}}>
                                <IonIcon slot="icon-only" icon={personOutline}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
            )}

            <IonContent fullscreen>
                <div style={{maxWidth, margin: "0 auto", padding: "16px" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", paddingTop: "4rem" }}>
                            <IonText color="medium">
                                <h2>Getting personalized recommendations…</h2>
                            </IonText>
                            <IonSpinner name="crescent" style={{ width: "3rem", height: "3rem", marginTop: "1rem" }} />
                        </div>
                    ) : (
                        <>
                            <IonText color="medium">
                                <h2 style={{ padding: "0 8px 16px" }}>
                                    Based on your recent interactions, the system recommends the following cars:
                                </h2>
                            </IonText>

                            <IonGrid>
                                {cars.map((car, idx) => (
                                    <IonRouterLink key={idx} routerLink={`/car-detail/${car.id}`}>
                                        <IonCard
                                            className="hover-expand-search"
                                            style={{
                                                display: 'flex',
                                                flexDirection: isMobile ? 'column' : 'row',
                                                position: 'relative',
                                                padding: '12px',
                                                minHeight: isMobile ? 'auto' : '200px',
                                            }}
                                        >
                                            {/* Imagine */}
                                            <img
                                                src={`http://localhost:5000${car.imageUrl}`}
                                                alt={car.title}
                                                style={{
                                                    width: isMobile ? '100%' : '325px',
                                                    height: '195px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                }}
                                            />

                                            {/* Conținut */}
                                            <IonCardContent style={{ flex: 1, position: 'relative' }}>

                                                {/* Informații + Favorite (pe mobil) */}
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: isMobile ? 'flex-start' : 'center',
                                                        gap: '10px',
                                                        flexWrap: 'wrap',
                                                    }}
                                                >
                                                    <IonLabel style={{ flex: 1 }}>
                                                        <h1>{car.title}</h1>
                                                        <p>{car.make} {car.model}</p>
                                                        <p>{car.mileage} km • {car.year} • {car.location}</p>
                                                    </IonLabel>

                                                    {/* Favorite pe mobil (în dreapta titlului) */}
                                                    {isMobile && (
                                                        <IonButton
                                                            fill="clear"
                                                            disabled={!isLoggedIn}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                if (!isLoggedIn) return;
                                                                toggleFavorite(car.id, car.isFavorite);
                                                            }}
                                                            style={{
                                                                width: '48px',
                                                                height: '48px',
                                                                "--border-radius": "50%",
                                                                "--background": car.isFavorite ? "#4ad493" : "transparent",
                                                                "--color": car.isFavorite ? "#121212" : "#1f1f1f",
                                                                opacity: isLoggedIn ? 1 : 0.4,
                                                            }}
                                                        >
                                                            <IonIcon
                                                                slot="icon-only"
                                                                src="/park-icon-dark.svg"
                                                                style={{ width: '26px', height: '26px' }}
                                                            />
                                                        </IonButton>
                                                    )}
                                                </div>

                                                {/* Owner */}
                                                <div
                                                    style={{
                                                        position: isMobile ? 'static' : 'absolute',
                                                        bottom: isMobile ? 'auto' : '20px',
                                                        left: isMobile ? 'auto' : '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        marginTop: isMobile ? '12px' : 0,
                                                    }}
                                                >
                                                    <img
                                                        src={`http://localhost:5000${car.ownerPfp}`}
                                                        alt="Profile"
                                                        style={{
                                                            width: '45px',
                                                            height: '45px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            border: '2px solid #4ad493',
                                                        }}
                                                    />
                                                    <span style={{ fontSize: '1.4rem', fontWeight: 500 }}>{car.ownerUserName}</span>
                                                </div>

                                                {/* Timer + Bid */}
                                                <div
                                                    style={{
                                                        position: isMobile ? 'static' : 'absolute',
                                                        top: isMobile ? undefined : '20px',
                                                        right: isMobile ? undefined : '20px',
                                                        backgroundColor: '#4ad493',
                                                        color: '#121212',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '6px 12px',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.95rem',
                                                        fontWeight: 600,
                                                        gap: '10px',
                                                        marginTop: isMobile ? '12px' : 0,
                                                        alignSelf: isMobile ? 'flex-start' : undefined,
                                                    }}
                                                >
                                                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '1rem' }}>⏱</span>
                                                    <span><CountdownTimer startTime={car.startTime} /></span>
                                                    <span style={{ opacity: 0.8 }}>Bid</span>
                                                    <span style={{ fontWeight: 700 }}>
                                                €{Intl.NumberFormat('en-US').format(car.currentBid)}
                                            </span>
                                                </div>
                                            </IonCardContent>

                                            {/* Favorite pe desktop (în colț) */}
                                            {!isMobile && (
                                                <IonButton
                                                    fill="clear"
                                                    disabled={!isLoggedIn}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (!isLoggedIn) return;
                                                        toggleFavorite(car.id, car.isFavorite);
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '100px',
                                                        right: '30px',
                                                        width: '60px',
                                                        height: '60px',
                                                        "--border-radius": "50%",
                                                        "--background": car.isFavorite ? "#4ad493" : "transparent",
                                                        "--color": car.isFavorite ? "#121212" : "#1f1f1f",
                                                        opacity: isLoggedIn ? 1 : 0.4,
                                                    }}
                                                >
                                                    <IonIcon
                                                        slot="icon-only"
                                                        src="/park-icon-dark.svg"
                                                        style={{ width: '41px', height: '41px', marginLeft: '3.5px', marginTop: '2px' }}
                                                    />
                                                </IonButton>
                                            )}
                                        </IonCard>
                                    </IonRouterLink>
                                ))}
                            </IonGrid>
                        </>

                    )}
                </div>
            </IonContent>
            {isMobile && (
                <IonFooter className="ion-hide-md-up">
                    <IonToolbar
                        style={{
                            '--background': 'var(--ion-background-color)',
                            paddingBottom: 'env(safe-area-inset-bottom)',
                        }}
                    >
                        <IonButtons
                            slot="start"
                            style={{
                                width: '100%',
                                justifyContent: 'space-around',
                            }}
                        >
                            {[
                                { href: '/home', icon: homeOutline, label: 'Home' },
                                { href: '/car-favorites', icon: carSportOutline, label: 'Parked' },
                                { href: '/car-recommendations', icon: sparklesOutline, label: 'AI' },
                                { href: '/sell-car', icon: cashOutline, label: 'Sell' },
                                { href: '/auth', icon: personOutline, label: 'Account' },
                            ].map(({ href, icon, label }) => {
                                const isActive = location.pathname === href;
                                return (
                                    <IonButton
                                        key={href}
                                        fill="clear"
                                        routerLink={href}
                                        style={{
                                            minWidth: '50px',
                                            color: isActive ? '#4ad493' : 'var(--ion-color-medium)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <IonIcon icon={icon} />
                                            <span
                                                style={{
                                                    fontSize: '0.7rem',
                                                    marginTop: '2px',
                                                    lineHeight: 1,
                                                    color: 'inherit',
                                                }}
                                            >
                                            {label}
                                            </span>
                                        </div>
                                    </IonButton>
                                );
                            })}
                        </IonButtons>
                    </IonToolbar>
                </IonFooter>
            )}
        </IonPage>
    );

}

export default CarRecommendations;