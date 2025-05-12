import { Injectable } from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import JWT_SECRET_KEY from "src/util/constant";
// import JWT_SECRET_KEY  from '../../utils/constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // Extract JWT from the authorization headers 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // Reject expired tokens
            secretOrKey: JWT_SECRET_KEY! , // Use your JWT secret
        });
    }   

    // Passport will call this method after token validation
    async validate(payload: any) {
        // You can add additional validation logic here
        // For example, check if the user still exists in the database
        return { 
            id: payload.id, 
            email: payload.email,
            rstid: payload.restaurantId,
            usrname: payload.username,
            roles: payload.role
          };
    }
}