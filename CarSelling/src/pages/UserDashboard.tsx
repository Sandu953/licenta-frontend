import React, {useEffect, useState} from 'react';
import {
    IonContent,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonText, IonPage, IonToolbar, IonButtons, IonIcon, IonHeader, IonTitle,
    IonCardContent,
    IonCard
} from '@ionic/react';

const UserDashboard: React.FC = () => {
    const userId = localStorage.getItem("userId");

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>User Dashboard</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonText>Welcome back, user #{userId}</IonText>
            </IonContent>
        </IonPage>
    );
};

export default UserDashboard;
