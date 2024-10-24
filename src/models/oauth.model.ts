import mongooseService from "../common/services/mongoose.service";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
const mongoose = mongooseService.getMongoose();
const Schema = mongoose.Schema;

export interface IOauth {
    grant_type: string;
    username: string;
    password: string;
    scope?: string;
    client_secret: string;
    client_id: string;
}

const oauthSchema = new Schema({
    grant_type: String,
    username: String,
    password: String,
    scope: Array,
    client_secret: String,
    client_id: String
});

oauthSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

oauthSchema.set('toJSON', {
    virtuals: true
});

class Oauth {
    private static model = mongoose.model('Oauth', oauthSchema);

    static check_credentials_exist = async (oauth: IOauth) => {
        const { username, password, client_secret, client_id } = oauth;
        try {


            return await this.model.findOne({ username, password, client_id, client_secret }).exec();
        } catch (error: object | any) {
            throw new UnauthorizedError('e_4006', 'Proceso de autenticación fallido', error.message);
        }
    }
}

export default Oauth;