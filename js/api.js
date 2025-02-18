// Configuration de l'API
const API_URL = 'https://onix-api-gabu.onrender.com';
const AUTH_API_URL = 'https://onix-auth-7t0y.onrender.com/api/auth';

// Gestion des produits
async function getProducts() {
    console.log('Récupération des produits depuis l\'API...');
    try {
        const response = await fetch(`${API_URL}/products`);
        console.log(`Réponse reçue - Statut HTTP: ${response.status}`);
        
        const data = await response.json();
        console.log(`${data.length} produits récupérés avec succès`);
        
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', 
                     `Message: ${error.message}`, 
                     `Stack: ${error.stack}`);
        return [];
    }
}

// Gestion des commandes
async function createOrder(orderData) {
    console.log(`Création de commande avec ${orderData.items.length} articles`);
    try {
        const token = getToken();
        console.log(`Utilisation du token: ${token ? 'présent' : 'manquant'}`);

        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        console.log(`Réponse API - Statut: ${response.status}`);
        const data = await response.json();

        if (response.ok) {
            console.log(`Commande créée avec succès - ID: ${data.orderId}`);
            return data;
        } else {
            console.error('Erreur de création de commande:', 
                         `Code: ${data.code || 'inconnu'}`, 
                         `Message: ${data.message}`);
            throw new Error(data.message || 'Erreur lors de la création de la commande');
        }
    } catch (error) {
        console.error('Erreur critique lors de la création de commande:',
                     `Message: ${error.message}`, 
                     `Stack: ${error.stack}`);
        throw error;
    }
}

// Authentification
async function login(credentials) {
    console.log(`Tentative de connexion pour: ${credentials.username}`);
    try {
        const response = await fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        console.log(`Réponse authentification - Statut: ${response.status}`);
        const data = await response.json();

        if (response.ok) {
            console.log(`Connexion réussie pour: ${data.user.username} | Rôle: ${data.user.role}`);
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log(`Token stocké (${data.user.token.slice(0, 6)}...)`);
            return data.user;
        } else {
            console.error('Échec de la connexion:', 
                         `Code: ${data.code || response.status}`, 
                         `Message: ${data.error}`);
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Erreur de connexion:', 
                     `Type: ${error.name}`, 
                     `Message: ${error.message}`);
        throw error;
    }
}

async function register(userData) {
    console.log(`Nouvel enregistrement pour: ${userData.username}`);
    try {
        const response = await fetch(`${AUTH_API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        console.log(`Réponse inscription - Statut: ${response.status}`);

        if (response.ok) {
            console.log(`Utilisateur ${data.user.email} enregistré avec succès`);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.user;
        } else {
            console.error('Échec de l\'inscription:', 
                         `Erreurs: ${data.errors?.join(', ') || 'aucun détail'}`);
            throw new Error(data.error || 'Erreur inconnue');
        }
    } catch (error) {
        console.error('Erreur d\'inscription:', 
                     `Type: ${error.name}`, 
                     `Message: ${error.message}`);
        throw error;
    }
}

// Utilitaires
function getToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    console.log(`Récupération du token: ${token ? 'trouvé' : 'absent'}`);
    return token;
}

function isAuthenticated() {
    const authStatus = !!localStorage.getItem('user');
    console.log(`Vérification authentification: ${authStatus ? 'connecté' : 'non connecté'}`);
    return authStatus;
}

// Exportation des fonctions
export {
    getProducts,
    createOrder,
    login,
    register,
    isAuthenticated
};
