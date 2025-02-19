import React from 'react'
import { GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import google from '../assets/google.png'

function GoogleAuth({name}) {
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();

    provider.setCustomParameters({
      prompt:"select_account"
    });

    const handleGoogleSignIn = async () => {
      const loading = toast.loading('Signed in!', {duration: 2000});
        try {
          await signInWithPopup(auth,provider)
          toast.success('redirecting...', { id : loading})
          setTimeout(() => {
            navigate('/select_template');
          },1000);
        } catch(error) {
          toast.error("Sign in Failed Try Again")
        }
      }
  return (
    <button type='button' onClick={handleGoogleSignIn} className='text-black font-semibold border w-full py-2 rounded-md mt-3 shadow-md text-md flex items-center text-center justify-center'>
      <img className='w-4 mr-4' src={google} alt='lg' />{name}
    </button>
  )
}

export default GoogleAuth