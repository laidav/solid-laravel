# Base Project

### Tasks

#### Sign up page

- Update models for email verification - DONE
- add mailpit to see emails are coming through - DONE
- Add registration page 
  - backend 
    - register user endpoint - DONE
    - test with postman - DONE
    - check Mail pit - IN PROGRESS
  - frontend
    - add routing to app - DONE
    - Forms 
      - Context - DONE
      - Field - DONE

    - create bare bones user sign up page - DONE
      - set up api - DONE
      - TextInput and Email Fields - DONE
      - on success show the notice page - DONE

    - test rendering of context - DONE

    - standardize api calls for auth and no auth - DONE

- Email verification handler - DONE

### Need email verification and resend (logged in but not verified) (After creating user or trying to logging in to see a page but not yet verified)
  - NOTE RIGHT NOW LOGGING IN AFTER CREATION ONLY, BUT ALSO AVAILABLE AFTER LOGGING IN
  - backend 
    - add endpoint for resending - IN PROGRESS - DONE
  - frontend
    - update success page to have button to resend notice - DONE

#### Auth guards
- flow
  - load app

  - see if user is logged in, if not and is guarded 
    - should return user
    - if not logged in kick to login page (make a stub)

  - if logged in but not verified send to verify notice page

- Backend
  - check login status endpoint - returns user? - DONE

- Frontend - DONE  
  - RxApp
    - RxAuth - DONE
    - refactor to separate concerns - DONE
  - also guards - DONE
    - Guarded component - DONE
    - for both logged in - DONE
    - then verified users - DONE

#### Login Page
- BACKEND
  - auth controller - DONE
  - api - DONE
  - throttling
- FRONTEND
  - form
  - throtteling

#### Reset Password Page

#### Docker Container