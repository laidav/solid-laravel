# Base Project

### Tasks

#### Reset Password Page
  - send link - DONE
  - reset password - DONE
    - BE - DONE
    - FE - DONE

#### Logout - DONE

#### Two factor auth - IN PROGRESS
- password confirm for changing 2fa stuff
  - BE
    - add middleware to applicable routes - DONE
    - add password confirm endpoint

  - FE - 
    - update auth service with password confirm - DONE
    RxRequest
      - accept events from RxApp password recent
          - if success do api call again
          - if reset
            - continue returning a failure and user can try the flow again
            - on failure close the prompt modal
      - add extra state
- login flow 
  - 2fa confirmation



#### Settle on folder structure

#### Docker Container

#### selectors and clean up