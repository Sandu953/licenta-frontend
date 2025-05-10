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
    IonNote
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
import { useHistory } from "react-router-dom"
//import "./UserDashboard.css"

const Dashboard: React.FC = () => {
    const userId = localStorage.getItem("userId")
    const userName = localStorage.getItem("userName") || "User"
    const [maxWidth, setMaxWidth] = useState("1400px")
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches)
    const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard")
    const history = useHistory()

    // Example auction and bid data - in a real app, this would come from an API
    const activeAuctions = [
        {
            id: 1,
            car: "BMW 5 Series",
            currentBid: "€45,000",
            bidders: 8,
            timeLeft: "23h 45m",
            image: "/car1.jpg",
        },
    ]

    const pastAuctions = [
        {
            id: 2,
            car: "Audi A6",
            finalPrice: "€42,000",
            status: "sold",
            endedDaysAgo: 2,
            image: "/car2.jpg",
        },
        {
            id: 3,
            car: "Ford Mustang",
            status: "expired",
            endedDaysAgo: 3,
            image: "/car5.jpg",
        },
    ]

    const activeBids = [
        {
            id: 4,
            car: "Ferrari 812",
            yourBid: "€90,000",
            status: "leading",
            bidTime: "2h ago",
            image: "/car7.jpg",
        },
        {
            id: 5,
            car: "Audi A6",
            yourBid: "€42,000",
            status: "outbid",
            bidTime: "5h ago",
            image: "/car2.jpg",
        },
    ]

    const pastBids = [
        {
            id: 6,
            car: "BMW M4",
            yourBid: "€60,000",
            finalStatus: "lost",
            image: "/car8.jpg",
        },
        {
            id: 7,
            car: "Tesla Model Y",
            yourBid: "€52,000",
            finalStatus: "won",
            image: "/car4.jpg",
        },
    ]

    const messages = [
        {
            id: 1,
            sender: "SellerMike",
            avatar: "/placeholder.svg?height=40&width=40",
            message: "Still interested in the BMW?",
            time: "2h ago",
            isNew: true,
        },
        {
            id: 2,
            sender: "AutoQueen",
            avatar: "/placeholder.svg?height=40&width=40",
            message: "Let's finalize the deal!",
            time: "Yesterday",
            isNew: false,
        },
    ]

    const notifications = [
        {
            id: 1,
            title: "New bid on your BMW",
            message: "Someone placed a bid of €46,000",
            time: "10m ago",
        },
        {
            id: 2,
            title: "Auction ending soon",
            message: "Your Ferrari 812 auction ends in 2 hours",
            time: "1h ago",
        },
    ]

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
            // localStorage.clear();
            // window.location.href = "/auth";
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

    const navigateTo = (route: string) => {
        history.push(route)
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "sold":
            case "leading":
            case "won":
                return "success"
            case "outbid":
            case "expired":
            case "lost":
                return "danger"
            default:
                return "medium"
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar style={{ maxWidth, margin: "0 auto", "--background": isDarkMode ? "#121212" : "#fff" as any }}>
                    <IonButtons slot="start">
                        <IonButton routerLink="/" fill="clear" style={{"--color-hover": "#4ad493" as any}}>
                            <IonImg src="/logo-placeholder.png" alt="Logo" style={{ height: "40px" }} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="primary" style={{ display: "flex", gap: "15px" }}>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493" as any}}>
                            Parked
                        </IonButton>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493" as any}}>
                            Recommendations
                        </IonButton>
                        <IonButton routerLink="/sell-car" style={{"--color-hover": "#4ad493" as any}}>
                            Sell a Car
                        </IonButton>
                        <IonButton routerLink="/auth" style={{ backgroundColor: "#4ad493", color: "#121212", borderRadius: "50px"}}>
                            <IonIcon slot="icon-only" icon={personOutline}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <div style={{ maxWidth, margin: "0 auto" }}>
                    {/* Welcome Card */}
                    <IonCard style={{display:"flex",marginTop:"20px", marginBottom: "20px", padding: "20px", alignItems: "center", borderRadius: "8px" }}>
                        {/*<IonCard style={{ display: "flex", alignItems: "center", padding: "20px" }}>*/}
                            <IonAvatar style={{ width: "80px", height: "80px", marginRight: "20px" }}>
                                <img src={profilePictureUrl || "/park-icon-green.svg"} alt="Profile" />
                                {/*alt="Profile"*/}
                                {/*style={{ width: "100%", height: "100%", objectFit: "cover" }}*/}
                            </IonAvatar>
                            <div>

                                <IonTitle color="dark" size="large" style={{  fontSize: "28px" }}>Welcome back, {userName}!</IonTitle>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ marginTop: "10px" }}
                                />
                            </div>
                            <IonButton color="danger" size="small" onClick={handleLogout} style={{ marginLeft: "auto", color: "#121212" }}>
                                Logout
                            </IonButton>
                    </IonCard>

                    <IonGrid>
                        <IonRow>
                            {/* My Auctions Section */}
                            <IonCol size="12" sizeMd="6" sizeLg="4">
                                <IonCard>
                                    <IonCardHeader>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <IonCardTitle>My Auctions</IonCardTitle>
                                            <IonButton fill="clear" onClick={() => setActiveSidebarItem("auctions")}>
                                                View All <IonIcon icon={chevronForwardOutline} />
                                            </IonButton>
                                        </div>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        {activeAuctions.length > 0 && (
                                            <IonList>
                                                <IonListHeader>
                                                    <IonLabel>Active Auctions</IonLabel>
                                                </IonListHeader>
                                                {activeAuctions.map((auction) => (
                                                    <IonItem key={auction.id} lines="full" detail={false}>
                                                        <IonThumbnail slot="start" style={{ position: "relative" }}>
                                                            <IonImg src={auction.image || "/placeholder.svg"} alt={auction.car} />
                                                            <IonChip
                                                                color="primary"
                                                                style={{
                                                                    position: "absolute",
                                                                    bottom: "5px",
                                                                    left: "50%",
                                                                    transform: "translateX(-50%)",
                                                                    fontSize: "10px",
                                                                    height: "20px"
                                                                }}
                                                            >
                                                                <IonIcon icon={timerOutline} />
                                                                <IonLabel>{auction.timeLeft}</IonLabel>
                                                            </IonChip>
                                                        </IonThumbnail>
                                                        <IonLabel>
                                                            <h2>{auction.car}</h2>
                                                            <IonText color="medium">Current Bid: <IonText color="primary">{auction.currentBid}</IonText></IonText>
                                                            <p>Bidders: {auction.bidders}</p>
                                                        </IonLabel>
                                                    </IonItem>
                                                ))}
                                            </IonList>
                                        )}

                                        {pastAuctions.length > 0 && (
                                            <IonList>
                                                <IonListHeader>
                                                    <IonLabel>Past Auctions</IonLabel>
                                                </IonListHeader>
                                                {pastAuctions.map((auction) => (
                                                    <IonItem key={auction.id} lines="full" detail={false}>
                                                        <IonThumbnail slot="start" style={{ position: "relative" }}>
                                                            <IonImg src={auction.image || "/placeholder.svg"} alt={auction.car} />
                                                        </IonThumbnail>
                                                        <IonLabel>
                                                            <h2>{auction.car}</h2>
                                                            {auction.finalPrice && (
                                                                <IonText color="medium">Final Price: {auction.finalPrice}</IonText>
                                                            )}
                                                            <p>Ended: {auction.endedDaysAgo} days ago</p>
                                                        </IonLabel>
                                                        <IonBadge
                                                            color={auction.status === "sold" ? "success" : "medium"}
                                                            slot="end"
                                                        >
                                                            {auction.status === "sold" ? "Sold" : "Expired"}
                                                        </IonBadge>
                                                    </IonItem>
                                                ))}
                                            </IonList>
                                        )}

                                        {activeAuctions.length === 0 && pastAuctions.length === 0 && (
                                            <div style={{ textAlign: "center", padding: "20px" }}>
                                                <IonText color="medium">You don't have any auctions yet.</IonText>
                                                <div style={{ marginTop: "15px" }}>
                                                    <IonButton
                                                        fill="solid"
                                                        style={{ "--background": "#4ad493", "--color": "#121212" } as any}
                                                        routerLink="/sell-car"
                                                    >
                                                        Create Your First Auction
                                                    </IonButton>
                                                </div>
                                            </div>
                                        )}
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            {/* My Bids Section */}
                            <IonCol size="12" sizeMd="6" sizeLg="4">
                                <IonCard>
                                    <IonCardHeader>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <IonCardTitle>My Bids</IonCardTitle>
                                            <IonButton fill="clear" onClick={() => setActiveSidebarItem("bids")}>
                                                View All <IonIcon icon={chevronForwardOutline} />
                                            </IonButton>
                                        </div>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        {activeBids.length > 0 && (
                                            <IonList>
                                                <IonListHeader>
                                                    <IonLabel>Active Bids</IonLabel>
                                                </IonListHeader>
                                                {activeBids.map((bid) => (
                                                    <IonItem key={bid.id} lines="full" detail={false}>
                                                        <IonThumbnail slot="start">
                                                            <IonImg src={bid.image || "/placeholder.svg"} alt={bid.car} />
                                                        </IonThumbnail>
                                                        <IonLabel>
                                                            <h2>{bid.car}</h2>
                                                            <IonText color="medium">Your Bid: {bid.yourBid}</IonText>
                                                            <p>Bid time: {bid.bidTime}</p>
                                                        </IonLabel>
                                                        <IonBadge slot="end" color={getStatusColor(bid.status)}>
                                                            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                                        </IonBadge>
                                                    </IonItem>
                                                ))}
                                            </IonList>
                                        )}

                                        {pastBids.length > 0 && (
                                            <IonList>
                                                <IonListHeader>
                                                    <IonLabel>Past Bids</IonLabel>
                                                </IonListHeader>
                                                {pastBids.map((bid) => (
                                                    <IonItem key={bid.id} lines="full" detail={false}>
                                                        <IonThumbnail slot="start">
                                                            <IonImg src={bid.image || "/placeholder.svg"} alt={bid.car} />
                                                        </IonThumbnail>
                                                        <IonLabel>
                                                            <h2>{bid.car}</h2>
                                                            <IonText color="medium">Your Bid: {bid.yourBid}</IonText>
                                                        </IonLabel>
                                                        <IonBadge slot="end" color={getStatusColor(bid.finalStatus)}>
                                                            {bid.finalStatus.charAt(0).toUpperCase() + bid.finalStatus.slice(1)}
                                                        </IonBadge>
                                                    </IonItem>
                                                ))}
                                            </IonList>
                                        )}

                                        {activeBids.length === 0 && pastBids.length === 0 && (
                                            <div style={{ textAlign: "center", padding: "20px" }}>
                                                <IonText color="medium">You haven't placed any bids yet.</IonText>
                                                <div style={{ marginTop: "15px" }}>
                                                    <IonButton
                                                        fill="solid"
                                                        style={{ "--background": "#4ad493", "--color": "#121212" } as any}
                                                        routerLink="/car-search"
                                                    >
                                                        Find Cars to Bid On
                                                    </IonButton>
                                                </div>
                                            </div>
                                        )}
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            {/* Messages & Notifications Section */}
                            <IonCol size="12" sizeMd="6" sizeLg="4">
                                <IonCard style={{ marginBottom: "20px" }}>
                                    <IonCardHeader>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <IonCardTitle>Messages</IonCardTitle>
                                            <IonButton fill="clear" onClick={() => setActiveSidebarItem("messages")}>
                                                View All <IonIcon icon={chevronForwardOutline} />
                                            </IonButton>
                                        </div>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        {messages.length > 0 ? (
                                            <IonList>
                                                {messages.map((message) => (
                                                    <IonItem key={message.id} lines="full" detail={false}>
                                                        <div style={{ position: 'relative' }} slot="start">
                                                            <IonAvatar>
                                                                <IonImg src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                                                            </IonAvatar>
                                                            {message.isNew && (
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    top: '0',
                                                                    right: '0',
                                                                    width: '10px',
                                                                    height: '10px',
                                                                    backgroundColor: '#4ad493',
                                                                    borderRadius: '50%'
                                                                }}></div>
                                                            )}
                                                        </div>
                                                        <IonLabel>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <h2>{message.sender}</h2>
                                                                <IonNote>{message.time}</IonNote>
                                                            </div>
                                                            <p>{message.message}</p>
                                                        </IonLabel>
                                                    </IonItem>
                                                ))}
                                            </IonList>
                                        ) : (
                                            <div style={{ textAlign: "center", padding: "20px" }}>
                                                <IonText color="medium">No messages yet.</IonText>
                                            </div>
                                        )}
                                    </IonCardContent>
                                </IonCard>

                                <IonCard>
                                    <IonCardHeader>
                                        <IonCardTitle>Recent Notifications</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        {notifications.length > 0 ? (
                                            <IonList>
                                                {notifications.map((notification) => (
                                                    <IonItem key={notification.id} lines="full" detail={false}>
                                                        <IonLabel>
                                                            <h2>{notification.title}</h2>
                                                            <p>{notification.message}</p>
                                                            <IonNote>{notification.time}</IonNote>
                                                        </IonLabel>
                                                    </IonItem>
                                                ))}
                                            </IonList>
                                        ) : (
                                            <div style={{ textAlign: "center", padding: "20px" }}>
                                                <IonText color="medium">No notifications.</IonText>
                                            </div>
                                        )}
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Dashboard
