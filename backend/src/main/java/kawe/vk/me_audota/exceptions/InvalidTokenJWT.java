package kawe.vk.me_audota.exceptions;

public class InvalidTokenJWT extends RuntimeException {

    public InvalidTokenJWT(String message) {
        super(message);
    }

    public InvalidTokenJWT(String message, Throwable cause) {
        super(message, cause);
    }
}