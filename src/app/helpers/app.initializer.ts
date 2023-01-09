// import { AuthenticationService } from '@app/services';
import { catchError, finalize, of } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

export function appInitializer(authenticationService: AuthenticationService) {
  console.log('appInitializer');
  return () =>
    authenticationService.refreshToken().pipe(
      // catch error to start app on success or failure
      catchError(() => of())
    );
}
