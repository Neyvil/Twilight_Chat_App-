export const BACKEND_HOST =
  import.meta.env.NEXT_PUBLIC_BACKEND_HOST ||
  "https://twilight-chat-app.onrender.com";

const buildUrl = (route) => `${BACKEND_HOST}/${route}`;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = buildUrl(`${AUTH_ROUTES}/signup`);
export const LOGIN_ROUTE = buildUrl(`${AUTH_ROUTES}/login`);
export const GET_USER_INFO = buildUrl(`${AUTH_ROUTES}/user-info`);
export const UPDATE_PROFILE_ROUTE = buildUrl(`${AUTH_ROUTES}/update-profile`);
export const ADD_PROFILE_IMAGE_ROUTE = buildUrl(
  `${AUTH_ROUTES}/add-profile-image`
);
export const REMOVE_PROFILE_IMAGE_ROUTE = buildUrl(
  `${AUTH_ROUTES}/remove-profile-image`
);
export const LOG_OUT_ROUTE = buildUrl(`${AUTH_ROUTES}/logout`);

export const CONTACTS_ROUTES = "api/contacts";
export const SEARCHED_CONTACT_ROUTE = buildUrl(`${CONTACTS_ROUTES}/search`);
export const GET_DM_CONTACTS_ROUTES = buildUrl(
  `${CONTACTS_ROUTES}/get-contact-for-DM`
);
export const GET_ALL_CONTACTS_ROUTES = buildUrl(
  `${CONTACTS_ROUTES}/get-all-contacts`
);

export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES = buildUrl(`${MESSAGES_ROUTES}/get-messages`);
export const UPLOAD_FILE_ROUTE = buildUrl(`${MESSAGES_ROUTES}/upload-file`);

export const CHANNEL_ROUTES = "api/channels";
export const CREATE_CHANNEL_ROUTES = buildUrl(
  `${CHANNEL_ROUTES}/create-channel`
);
export const GET_USER_CHANNELS_ROUTES = buildUrl(
  `${CHANNEL_ROUTES}/get-user-channels`
);
export const GET_CHANNEL_MESSAGES_ROUTES = buildUrl(
  `${CHANNEL_ROUTES}/get-channel-messages`
);
