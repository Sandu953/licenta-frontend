import type React from "react"
import { useEffect, useState, useRef } from "react"
import {
    IonPage,
    IonHeader,
    IonToolbar,
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
    IonCardHeader,
    IonCardTitle,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonLabel,
    IonItem,
    IonChip,
    IonToggle,
} from "@ionic/react"
import { personOutline, addCircleOutline, closeCircleOutline, cameraOutline } from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "./SellCar.css"

const SellCar: React.FC = () => {
    const [maxWidth, setMaxWidth] = useState("1400px")
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<string[]>([])
    const [features, setFeatures] = useState<string[]>([])
    const [newFeature, setNewFeature] = useState("")
    const [currentStep, setCurrentStep] = useState(1)
    const history = useHistory()

    // Form state
    const [carDetails, setCarDetails] = useState({
        brand: "",
        model: "",
        year: "",
        mileage: "",
        trim: "",
        price: "",
        fuel: "",
        transmission: "",
        bodyType: "",
        engine: "",
        horsepower: "",
        description: "",
        location: "",
        reservePrice: "",
        title: "",
    })

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

    useEffect(() => {
        updateMaxWidth()
        window.addEventListener("resize", updateMaxWidth)
        return () => window.removeEventListener("resize", updateMaxWidth)
    }, [])

    const handleInputChange = (e: CustomEvent, field: string) => {
        setCarDetails({
            ...carDetails,
            [field]: e.detail.value,
        })
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
            setImages([...images, ...newImages])
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)
    }

    const addFeature = () => {
        if (newFeature.trim() !== "" && !features.includes(newFeature.trim())) {
            setFeatures([...features, newFeature.trim()])
            setNewFeature("")
        }
    }

    const removeFeature = (index: number) => {
        const newFeatures = [...features]
        newFeatures.splice(index, 1)
        setFeatures(newFeatures)
    }

    const nextStep = () => {
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
    }

    const prevStep = () => {
        setCurrentStep(currentStep - 1)
        window.scrollTo(0, 0)
    }

    const handleSubmit = () => {
        // Here you would typically send the data to your backend
        console.log("Submitting car details:", { ...carDetails, features, images })

        // For demo purposes, just navigate to dashboard
        alert("Your car has been submitted for auction!")
        history.push("/dashboard")
        setCurrentStep(1) // Reset to the first step
    }

    return (
        <IonPage>
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
                            Recommendations
                        </IonButton>
                        <IonButton routerLink="/sell-car" style={{ "--color-hover": "#4ad493" }}>
                            Sell a Car
                        </IonButton>
                        <IonButton
                            routerLink="/auth"
                            style={{ backgroundColor: "#4ad493", color: "#121212", borderRadius: "50px" }}
                        >
                            <IonIcon slot="icon-only" icon={personOutline}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <div style={{ maxWidth, margin: "0 auto", padding: "20px" }}>
                    <h1 style={{ color: "#4ad493", marginBottom: "20px" }}>Sell Your Car</h1>

                    {/* Progress indicator */}
                    <div className="progress-container">
                        <div className="progress-step">
                            <div className={`step-circle ${currentStep >= 1 ? "active" : ""}`}>1</div>
                            <div className="step-label">Car Details</div>
                        </div>
                        <div className="progress-line"></div>
                        <div className="progress-step">
                            <div className={`step-circle ${currentStep >= 2 ? "active" : ""}`}>2</div>
                            <div className="step-label">Photos</div>
                        </div>
                        <div className="progress-line"></div>
                        <div className="progress-step">
                            <div className={`step-circle ${currentStep >= 3 ? "active" : ""}`}>3</div>
                            <div className="step-label">Auction Settings</div>
                        </div>
                        <div className="progress-line"></div>
                        <div className="progress-step">
                            <div className={`step-circle ${currentStep >= 4 ? "active" : ""}`}>4</div>
                            <div className="step-label">Review</div>
                        </div>
                    </div>

                    {/* Step 1: Basic Car Details */}
                    {currentStep === 1 && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Car Details</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label = "Listing Title"
                                                    labelPlacement="floating"
                                                    value={carDetails.title}
                                                    onIonChange={(e) => handleInputChange(e, "title")}
                                                    placeholder="e.g., 2020 BMW 5 Series - Excellent Condition"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonSelect
                                                    label="Brand"
                                                    labelPlacement="floating"
                                                    value={carDetails.brand}
                                                    onIonChange={(e) => handleInputChange(e, "brand")}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                >
                                                    <IonSelectOption value="BMW">BMW</IonSelectOption>
                                                    <IonSelectOption value="Audi">Audi</IonSelectOption>
                                                    <IonSelectOption value="Mercedes">Mercedes</IonSelectOption>
                                                    <IonSelectOption value="Tesla">Tesla</IonSelectOption>
                                                    <IonSelectOption value="Ford">Ford</IonSelectOption>
                                                    <IonSelectOption value="Porsche">Porsche</IonSelectOption>
                                                    <IonSelectOption value="Ferrari">Ferrari</IonSelectOption>
                                                </IonSelect>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonSelect
                                                    label="Model"
                                                    labelPlacement="floating"
                                                    value={carDetails.model}
                                                    onIonChange={(e) => handleInputChange(e, "model")}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                >
                                                    <IonSelectOption value="BMW">BMW</IonSelectOption>
                                                    <IonSelectOption value="Audi">Audi</IonSelectOption>
                                                    <IonSelectOption value="Mercedes">Mercedes</IonSelectOption>
                                                    <IonSelectOption value="Tesla">Tesla</IonSelectOption>
                                                    <IonSelectOption value="Ford">Ford</IonSelectOption>
                                                    <IonSelectOption value="Porsche">Porsche</IonSelectOption>
                                                    <IonSelectOption value="Ferrari">Ferrari</IonSelectOption>
                                                </IonSelect>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Year"
                                                    labelPlacement="floating"
                                                    type="number"
                                                    value={carDetails.year}
                                                    onIonChange={(e) => handleInputChange(e, "year")}
                                                    placeholder="e.g., 2020"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonSelect
                                                    label="Trim"
                                                    labelPlacement="floating"
                                                    value={carDetails.trim}
                                                    onIonChange={(e) => handleInputChange(e, "trim")}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                >
                                                    <IonSelectOption value="Petrol">Petrol</IonSelectOption>
                                                    <IonSelectOption value="Diesel">Diesel</IonSelectOption>
                                                    <IonSelectOption value="Electric">Electric</IonSelectOption>
                                                    <IonSelectOption value="Hybrid">Hybrid</IonSelectOption>
                                                </IonSelect>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Mileage (KM)"
                                                    labelPlacement="floating"
                                                    type="number"
                                                    value={carDetails.mileage}
                                                    onIonChange={(e) => handleInputChange(e, "mileage")}
                                                    placeholder="e.g., 50000"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonSelect
                                                    label="Fuel"
                                                    labelPlacement="floating"
                                                    value={carDetails.fuel}
                                                    onIonChange={(e) => handleInputChange(e, "fuel")}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                >
                                                    <IonSelectOption value="Petrol">Petrol</IonSelectOption>
                                                    <IonSelectOption value="Diesel">Diesel</IonSelectOption>
                                                    <IonSelectOption value="Electric">Electric</IonSelectOption>
                                                    <IonSelectOption value="Hybrid">Hybrid</IonSelectOption>
                                                </IonSelect>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Engine Size"
                                                    labelPlacement="floating"
                                                    type="number"
                                                    value={carDetails.engine}
                                                    onIonChange={(e) => handleInputChange(e, "engine")}
                                                    placeholder="e.g., 1996"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Horsepower"
                                                    labelPlacement="floating"
                                                    type="number"
                                                    value={carDetails.horsepower}
                                                    onIonChange={(e) => handleInputChange(e, "horsepower")}
                                                    placeholder="e.g., 450"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonSelect
                                                    label="Body Type"
                                                    labelPlacement="floating"
                                                    value={carDetails.bodyType}
                                                    onIonChange={(e) => handleInputChange(e, "bodyType")}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                >
                                                    <IonSelectOption value="Sedan">Sedan</IonSelectOption>
                                                    <IonSelectOption value="SUV">SUV</IonSelectOption>
                                                    <IonSelectOption value="Coupe">Coupe</IonSelectOption>
                                                    <IonSelectOption value="Convertible">Convertible</IonSelectOption>
                                                    <IonSelectOption value="Hatchback">Hatchback</IonSelectOption>
                                                    <IonSelectOption value="Wagon">Wagon</IonSelectOption>
                                                </IonSelect>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Location"
                                                    labelPlacement="floating"
                                                    value={carDetails.location}
                                                    onIonChange={(e) => handleInputChange(e, "location")}
                                                    placeholder="e.g., Berlin, Germany"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12">
                                            <IonItem>
                                                <IonLabel position="floating">Description</IonLabel>
                                                <IonTextarea
                                                    value={carDetails.description}
                                                    onIonChange={(e) => handleInputChange(e, "description")}
                                                    placeholder="Describe your car in detail. Include condition, history, modifications, etc."
                                                    rows={6}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonTextarea>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                <div className="button-container">
                                    <IonButton onClick={nextStep} style={{ "--background": "#4ad493" }}>
                                        Next: Photos
                                    </IonButton>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Step 2: Photos & Features */}
                    {currentStep === 2 && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Photos</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <h3>Upload Photos</h3>
                                <p>High-quality photos increase your chances of selling. Add at least 5 photos.</p>

                                <div className="photo-upload-container">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        multiple
                                        accept="image/*"
                                        style={{ display: "none" }}
                                    />

                                    <div className="photo-grid">
                                        {images.map((image, index) => (
                                            <div key={index} className="photo-item">
                                                <img src={image || "/placeholder.svg"} alt={`Car upload ${index + 1}`} />
                                                <button className="remove-photo" onClick={() => removeImage(index)}>
                                                    <IonIcon icon={closeCircleOutline} />
                                                </button>
                                            </div>
                                        ))}

                                        <div className="add-photo-button" onClick={() => fileInputRef.current?.click()}>
                                            <IonIcon icon={cameraOutline} />
                                            <span>Add Photo</span>
                                        </div>
                                    </div>
                                </div>

                                {/*<h3 style={{ marginTop: "30px" }}>Car Features</h3>*/}
                                {/*<p>Add key features of your car to make it stand out.</p>*/}

                                {/*<div className="features-container">*/}
                                {/*    <div className="add-feature">*/}
                                {/*        <IonInput*/}
                                {/*            value={newFeature}*/}
                                {/*            onIonChange={(e) => setNewFeature(e.detail.value || "")}*/}
                                {/*            placeholder="e.g., Leather Seats"*/}
                                {/*            style={{ "--highlight-color-focused": "#4ad493" }}*/}
                                {/*        ></IonInput>*/}
                                {/*        <IonButton onClick={addFeature} style={{ "--background": "#4ad493" }}>*/}
                                {/*            <IonIcon slot="icon-only" icon={addCircleOutline}></IonIcon>*/}
                                {/*        </IonButton>*/}
                                {/*    </div>*/}

                                {/*    <div className="features-list">*/}
                                {/*        {features.map((feature, index) => (*/}
                                {/*            <IonChip key={index} className="feature-chip">*/}
                                {/*                <IonLabel>{feature}</IonLabel>*/}
                                {/*                <IonIcon icon={closeCircleOutline} onClick={() => removeFeature(index)} />*/}
                                {/*            </IonChip>*/}
                                {/*        ))}*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                <div className="button-container">
                                    <IonButton onClick={prevStep} fill="outline">
                                        Back
                                    </IonButton>
                                    <IonButton onClick={nextStep} style={{ "--background": "#4ad493" }}>
                                        Next: Auction Settings
                                    </IonButton>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Step 3: Auction Settings */}
                    {currentStep === 3 && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Auction Settings</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Starting Price (EUR)"
                                                    labelPlacement="floating"
                                                    type="number"
                                                    value={carDetails.price}
                                                    onIonChange={(e) => handleInputChange(e, "price")}
                                                    placeholder="e.g., 45000"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Reserve Price (EUR, optional)"
                                                    labelPlacement="floating"
                                                    type="number"
                                                    value={carDetails.reservePrice}
                                                    onIonChange={(e) => handleInputChange(e, "reservePrice")}
                                                    placeholder="Minimum price you'll accept"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>

                                {/*    <IonRow>*/}
                                {/*        <IonCol size="12">*/}
                                {/*            <IonItem lines="none" className="toggle-item">*/}
                                {/*                <IonLabel>*/}
                                {/*                    <h2>Featured Listing</h2>*/}
                                {/*                    <p>Get more visibility for your auction (additional fee applies)</p>*/}
                                {/*                </IonLabel>*/}
                                {/*                <IonToggle slot="end" style={{ "--background-checked": "#4ad493" }}></IonToggle>*/}
                                {/*            </IonItem>*/}
                                {/*        </IonCol>*/}
                                {/*    </IonRow>*/}
                                {/*    <IonRow>*/}
                                {/*        <IonCol size="12">*/}
                                {/*            <IonItem lines="none" className="toggle-item">*/}
                                {/*                <IonLabel>*/}
                                {/*                    <h2>Allow Offers</h2>*/}
                                {/*                    <p>Let buyers make offers outside the auction</p>*/}
                                {/*                </IonLabel>*/}
                                {/*                <IonToggle slot="end" checked={true} style={{ "--background-checked": "#4ad493" }}></IonToggle>*/}
                                {/*            </IonItem>*/}
                                {/*        </IonCol>*/}
                                {/*    </IonRow>*/}
                                </IonGrid>

                                <div className="button-container">
                                    <IonButton onClick={prevStep} fill="outline">
                                        Back
                                    </IonButton>
                                    <IonButton onClick={nextStep} style={{ "--background": "#4ad493" }}>
                                        Next: Review
                                    </IonButton>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Review Your Listing</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="review-section">
                                    <h3>Car Details</h3>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol size="12" sizeMd="6">
                                                <p>
                                                    <strong>Title:</strong> {carDetails.title || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Brand:</strong> {carDetails.brand || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Model:</strong> {carDetails.model || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Year:</strong> {carDetails.year || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Mileage:</strong> {carDetails.mileage ? `${carDetails.mileage} KM` : "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Location:</strong> {carDetails.location || "Not provided"}
                                                </p>
                                            </IonCol>
                                            <IonCol size="12" sizeMd="6">
                                                <p>
                                                    <strong>Fuel Type:</strong> {carDetails.fuel || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Transmission:</strong> {carDetails.transmission || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Body Type:</strong> {carDetails.bodyType || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Engine:</strong> {carDetails.engine || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Horsepower:</strong>{" "}
                                                    {carDetails.horsepower ? `${carDetails.horsepower} HP` : "Not provided"}
                                                </p>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </div>

                                <div className="review-section">
                                    <h3>Description</h3>
                                    <p>{carDetails.description || "No description provided."}</p>
                                </div>

                                {/*<div className="review-section">*/}
                                {/*    <h3>Features</h3>*/}
                                {/*    {features.length > 0 ? (*/}
                                {/*        <div className="features-list review-features">*/}
                                {/*            {features.map((feature, index) => (*/}
                                {/*                <IonChip key={index} className="feature-chip">*/}
                                {/*                    <IonLabel>{feature}</IonLabel>*/}
                                {/*                </IonChip>*/}
                                {/*            ))}*/}
                                {/*        </div>*/}
                                {/*    ) : (*/}
                                {/*        <p>No features added.</p>*/}
                                {/*    )}*/}
                                {/*</div>*/}

                                <div className="review-section">
                                    <h3>Photos</h3>
                                    {images.length > 0 ? (
                                        <div className="photo-grid review-photos">
                                            {images.map((image, index) => (
                                                <div key={index} className="photo-item">
                                                    <img src={image || "/placeholder.svg"} alt={`Car upload ${index + 1}`} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No photos uploaded.</p>
                                    )}
                                </div>

                                <div className="review-section">
                                    <h3>Auction Settings</h3>
                                    <p>
                                        <strong>Starting Price:</strong> {carDetails.price ? `€${carDetails.price}` : "Not provided"}
                                    </p>
                                    <p>
                                        <strong>Reserve Price:</strong>{" "}
                                        {carDetails.reservePrice ? `€${carDetails.reservePrice}` : "No reserve"}
                                    </p>
                                </div>

                                <div className="terms-section">
                                    <IonItem lines="none">
                                        <IonLabel className="ion-text-wrap">
                                            By submitting this listing, you agree to our Terms of Service and Auction Rules.
                                        </IonLabel>
                                        <IonToggle slot="start" checked={true} style={{ "--background-checked": "#4ad493" }}></IonToggle>
                                    </IonItem>
                                </div>

                                <div className="button-container">
                                    <IonButton onClick={prevStep} fill="outline">
                                        Back
                                    </IonButton>
                                    <IonButton onClick={handleSubmit} style={{ "--background": "#4ad493" }}>
                                        Submit Auction
                                    </IonButton>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    )}
                </div>
            </IonContent>
        </IonPage>
    )
}

export default SellCar
