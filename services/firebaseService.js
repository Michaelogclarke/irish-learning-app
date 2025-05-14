import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import { flashcards } from '../data/flashcards';

// Authentication functions
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: new Date(),
      scores: {
        currentStreak: 0,
        bestStreak: 0,
        totalCorrect: 0,
        totalAttempts: 0
      }
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Flashcard functions
export const getFlashcards = async () => {
  // For now, we're using the local data
  // In a production app, you would fetch this from Firestore
  return flashcards;
};

export const initializeFlashcardsInFirestore = async () => {
  try {
    const batch = [];
    
    for (const card of flashcards) {
      const docRef = doc(collection(db, 'flashcards'));
      batch.push(setDoc(docRef, { ...card, id: docRef.id }));
    }
    
    await Promise.all(batch);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// User scores functions
export const getUserScores = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      return { success: true, scores: userDoc.data().scores };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserScore = async (userId, correct) => {
  try {
    // Get current scores
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userDoc.data();
    const scores = userData.scores || {
      currentStreak: 0,
      bestStreak: 0,
      totalCorrect: 0,
      totalAttempts: 0
    };
    
    // Update scores
    if (correct) {
      scores.currentStreak += 1;
      scores.totalCorrect += 1;
      
      if (scores.currentStreak > scores.bestStreak) {
        scores.bestStreak = scores.currentStreak;
      }
    } else {
      scores.currentStreak = 0;
    }
    
    scores.totalAttempts += 1;
    
    // Update in Firestore
    await updateDoc(doc(db, 'users', userId), { scores });
    
    return { success: true, scores };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
