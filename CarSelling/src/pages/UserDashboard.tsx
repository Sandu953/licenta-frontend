import type React from "react"
import { useEffect, useState } from "react"
import {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonBadge,
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
    IonToolbar,
    IonButtons,
    IonHeader,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonText,
    IonImg,
    IonChip,
    IonList,
    IonListHeader,
    IonThumbnail,
    IonTitle,
    IonNote,
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
} from "@ionic/react"
import {
    carSportOutline,
    timerOutline,
    checkmarkCircleOutline,
    closeCircleOutline,
    chevronForwardOutline,
    mailOutline,
    notificationsOutline,
    personOutline,
} from "ionicons/icons"
import { cashOutline, homeOutline, sparklesOutline} from 'ionicons/icons';
import { useHistory } from "react-router-dom"
import {Redirect, Route, useLocation} from "react-router-dom";
//import "./UserDashboard.css"

const Dashboard: React.FC = () => {
    const userId = localStorage.getItem("userId")
    const userName = localStorage.getItem("userName") || "User"
    const [maxWidth, setMaxWidth] = useState("1400px")
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches)
    const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard")
    const history = useHistory()

    const [userAuctions, setUserAuctions] = useState<AuctionPreview[]>([]);
    const [userBids, setUserBids] = useState<AuctionPreview[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!userId || !token) return;

        const fetchData = async () => {
            try {
                const [auctionsRes, bidsRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/auctions/user-auctions/${userId}`, ),
                    fetch(`http://localhost:5000/api/auctions/user-bids/${userId}`, ),
                ]);

                if (auctionsRes.ok && bidsRes.ok) {
                    const auctions = await auctionsRes.json();
                    const bids = await bidsRes.json();
                    setUserAuctions(auctions);
                    setUserBids(bids);
                } else {
                    console.error("Failed to fetch user auctions or bids");
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [userId]);

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const activeUserAuctions = userAuctions.filter(a =>
        a.startTime && new Date(a.startTime) >= sevenDaysAgo
    );

    const pastUserAuctions = userAuctions.filter(a =>
        a.startTime && new Date(a.startTime) < sevenDaysAgo
    );

    const activeUserBids = userBids.filter(b =>
        b.startTime && new Date(b.startTime) >= sevenDaysAgo
    );

    const pastUserBids = userBids.filter(b =>
        b.startTime && new Date(b.startTime) < sevenDaysAgo
    );


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

    const accountHref = userId ? "/dashboard" : "/auth";

    interface AuctionPreview {
        id: number;
        title?: string;
        make?: string;
        model?: string;
        location?: string;
        year?: number;
        mileage?: number;
        currentBid?: number;
        startTime?: string; // ISO date
        imageUrl?: string;
        isFavorite?: boolean;
        ownerUserName?: string;
        ownerPfp?: string;
    }

    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        const token = localStorage.getItem("token");

        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/api/updateProfilePicture", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                const newPath = result.path;
                const fullUrl = `http://localhost:5000${newPath}`;
                setProfilePictureUrl(fullUrl);
                localStorage.setItem("profilePicturePath", newPath);
                window.location.reload();
            }
            else {
                console.error("Upload failed:", result.message);
            }
        } catch (err) {
            console.log(token);
            console.error("Error uploading image", err);
        }
    }

    useEffect(() => {
        const pathFromDb = localStorage.getItem("profilePicturePath");
        if (pathFromDb) {
            setProfilePictureUrl(`http://localhost:5000${pathFromDb}`);
        }
    }, []);


    useEffect(() => {
        // Listen for dark mode changes dynamically
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handleChange = (event: MediaQueryListEvent) => setIsDarkMode(event.matches)

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [])

    const updateMaxWidth = () => {
        if (window.innerWidth > 1800) {
            setMaxWidth("1600px")
        } else if (window.innerWidth > 1400) {
            setMaxWidth("1400px")
        } else if (window.innerWidth > 1200) {
            setMaxWidth("1200px")
        } else {
            setMaxWidth("100%")
        }
    }

    const handleLogout = async () => {
        localStorage.clear()
        window.location.href = "/auth"
    }

    useEffect(() => {
        updateMaxWidth()
        window.addEventListener("resize", updateMaxWidth)
        return () => window.removeEventListener("resize", updateMaxWidth)
    }, [])


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
                <div style={{ maxWidth, margin: "0 auto" }}>
                    {/* Welcome Card */}
                    <IonCard
                        style={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            marginTop: "20px",
                            marginBottom: "20px",
                            padding: "20px",
                            alignItems: isMobile ? "flex-start" : "center",
                            borderRadius: "8px",
                            gap: isMobile ? "16px" : "0",
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                            <IonAvatar style={{ width: "80px", height: "80px", marginRight: "2px" }}>
                                <img src={profilePictureUrl || "/park-icon-green.svg"} alt="Profile" />
                            </IonAvatar>

                            <div style={{ flex: 1 }}>
                                <IonTitle color="dark" size="large" style={{ fontSize: "24px" }}>
                                    Welcome back, {userName}!
                                </IonTitle>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ marginTop: "10px", marginLeft: "10px"}}
                                />
                            </div>
                        </div>

                        <IonButton
                            color="danger"
                            size="small"
                            onClick={handleLogout}
                            style={{
                                width: isMobile ? "100%" : "auto",
                                marginTop: isMobile ? "12px" : "0",
                                color: "#121212"
                            }}
                        >
                            Logout
                        </IonButton>
                    </IonCard>

                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" sizeMd="6">
                                <IonCard>
                                    <IonCardHeader>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <IonCardTitle>My Auctions</IonCardTitle>
                                        </div>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        {userAuctions.length > 0 ? (
                                            <>
                                                {/* Licitații Active */}
                                                <IonList>
                                                    <IonListHeader>
                                                        <IonLabel>Active Auctions</IonLabel>
                                                    </IonListHeader>
                                                    {activeUserAuctions.map((auction) => (
                                                        <IonItem key={auction.id} lines="full"  button routerLink={`/car-detail/${auction.id}`}>
                                                            <IonThumbnail slot="start" style={{ position: "relative" }}>
                                                                <IonImg src={`http://localhost:5000${auction.imageUrl}`} />
                                                                <IonChip
                                                                    color="primary"
                                                                    style={{
                                                                        position: "absolute",
                                                                        bottom: "5px",
                                                                        left: "50%",
                                                                        transform: "translateX(-50%)",
                                                                        fontSize: "10px",
                                                                        height: "20px",
                                                                    }}
                                                                >
                                                                </IonChip>
                                                            </IonThumbnail>
                                                            <IonLabel>
                                                                <h2>{auction.make} {auction.model}</h2>
                                                                <IonText color="medium">
                                                                    Year: {auction.year} • Mileage: {auction.mileage} km
                                                                </IonText>
                                                                <p>
                                                                    <IonText style={{'color': "#4ad493"}}>Current Bid: €{auction.currentBid}</IonText>
                                                                </p>
                                                            </IonLabel>
                                                            {auction.isFavorite && (
                                                                <IonBadge color="warning" slot="end">★ Favorite</IonBadge>
                                                            )}
                                                        </IonItem>
                                                    ))}
                                                </IonList>

                                                {/* Licitații Inactive */}
                                                <IonList>
                                                    <IonListHeader>
                                                        <IonLabel>Inactive Auctions</IonLabel>
                                                    </IonListHeader>
                                                    {pastUserAuctions.map((auction) => (
                                                        <IonItem key={auction.id} lines="full"  button routerLink={`/car-detail/${auction.id}`}>
                                                            <IonThumbnail slot="start" style={{ position: "relative" }}>
                                                                <IonImg src={`http://localhost:5000${auction.imageUrl}`} />
                                                                <IonChip
                                                                    color="medium"
                                                                    style={{
                                                                        position: "absolute",
                                                                        bottom: "5px",
                                                                        left: "50%",
                                                                        transform: "translateX(-50%)",
                                                                        fontSize: "10px",
                                                                        height: "20px",
                                                                    }}
                                                                >
                                                                </IonChip>
                                                            </IonThumbnail>
                                                            <IonLabel>
                                                                <h2>{auction.make} {auction.model}</h2>
                                                                <IonText color="medium">
                                                                    Year: {auction.year} • Mileage: {auction.mileage} km
                                                                </IonText>
                                                                <p>
                                                                    <IonText style={{'color': "#4ad493"}}>Current Bid: €{auction.currentBid}</IonText>
                                                                </p>
                                                            </IonLabel>
                                                        </IonItem>
                                                    ))}
                                                </IonList>
                                            </>
                                        ) : (
                                            <div style={{ textAlign: "center", padding: "20px" }}>
                                                <IonText color="medium">You don't have any auctions yet.</IonText>
                                                <div style={{ marginTop: "15px" }}>
                                                    <IonButton routerLink="/sell-car" style={{ "--background": "#4ad493", "--color": "#121212" }}>
                                                        Create Your First Auction
                                                    </IonButton>
                                                </div>
                                            </div>
                                        )}
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            {/* My Bids */}
                            <IonCol size="12" sizeMd="6">
                                <IonCard>
                                    <IonCardHeader>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <IonCardTitle>My Bids</IonCardTitle>
                                        </div>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        {userBids.length > 0 ? (
                                            <>
                                                {/* Licitații active */}
                                                <IonList>
                                                    <IonListHeader>
                                                        <IonLabel>Active Auctions</IonLabel>
                                                    </IonListHeader>
                                                    {activeUserBids.map((bid) => (
                                                        <IonItem key={bid.id} lines="full"  button routerLink={`/car-detail/${bid.id}`}>
                                                            <IonThumbnail slot="start" style={{ position: "relative" }}>
                                                                <IonImg src={`http://localhost:5000${bid.imageUrl}`} />
                                                                <IonChip
                                                                    color="medium"
                                                                    style={{
                                                                        position: "absolute",
                                                                        bottom: "5px",
                                                                        left: "50%",
                                                                        transform: "translateX(-50%)",
                                                                        fontSize: "10px",
                                                                        height: "20px",
                                                                    }}
                                                                >
                                                                </IonChip>
                                                            </IonThumbnail>

                                                            <IonLabel>
                                                                <h2>{bid.make} {bid.model}</h2>
                                                                <IonText color="medium">
                                                                    Year: {bid.year} • Mileage: {bid.mileage} km
                                                                </IonText>
                                                                <p>
                                                                    <IonText style={{'color': "#4ad493"}}>Current Bid: €{bid.currentBid}</IonText>
                                                                </p>
                                                                <IonNote>Seller: {bid.ownerUserName}</IonNote>
                                                            </IonLabel>
                                                        </IonItem>
                                                    ))}
                                                </IonList>

                                                {/* Licitații inactive */}
                                                <IonList>
                                                    <IonListHeader>
                                                        <IonLabel>Past Auctions</IonLabel>
                                                    </IonListHeader>
                                                    {pastUserBids.map((bid) => (
                                                        <IonItem key={bid.id} lines="full"  button routerLink={`/car-detail/${bid.id}`}>
                                                            <IonThumbnail slot="start" style={{ position: "relative" }}>
                                                                <IonImg src={`http://localhost:5000${bid.imageUrl}`} />
                                                                <IonChip
                                                                    color="medium"
                                                                    style={{
                                                                        position: "absolute",
                                                                        bottom: "5px",
                                                                        left: "50%",
                                                                        transform: "translateX(-50%)",
                                                                        fontSize: "10px",
                                                                        height: "20px",
                                                                    }}
                                                                >
                                                                </IonChip>
                                                            </IonThumbnail>
                                                            <IonLabel>
                                                                <h2>{bid.make} {bid.model}</h2>
                                                                <IonText color="medium">
                                                                    Year: {bid.year} • Mileage: {bid.mileage} km
                                                                </IonText>
                                                                <p>
                                                                    <IonText style={{'color': "#4ad493"}}>Current Bid: €{bid.currentBid}</IonText>
                                                                </p>
                                                                <IonNote>Seller: {bid.ownerUserName}</IonNote>
                                                            </IonLabel>
                                                        </IonItem>
                                                    ))}
                                                </IonList>
                                            </>
                                        ) : (
                                            <div style={{ textAlign: "center", padding: "20px" }}>
                                                <IonText color="medium">You haven't placed any bids yet.</IonText>
                                                <div style={{ marginTop: "15px" }}>
                                                    <IonButton routerLink="/car-search" style={{ "--background": "#4ad493", "--color": "#121212" }}>
                                                        Find Cars to Bid On
                                                    </IonButton>
                                                </div>
                                            </div>
                                        )}
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
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
                                { href: accountHref, icon: personOutline, label: 'Account' },
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
    )
}

export default Dashboard
