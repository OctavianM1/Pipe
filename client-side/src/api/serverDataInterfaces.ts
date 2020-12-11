// User
export interface ServerUser {
  id: string;
  email: string;
  name: string;
  countFollowers: number;
  countFollowing: number;
  numberOfActivities: number | null;
  isSubscribedToEmails: boolean;
  coverImageExtension: string | null;
  token: string | null;
}

// Activity
export interface ServerActivity {
  id: string;
  userHostId: string;
  userHostName: string;
  title: string;
  body: string;
  subject: string;
  dateTimeCreated: string;
  raiting: ServerActivityRaiting;
  likes: ServerActivityLikes;
  comments: ServerActivityComment[];
}

export interface ServerActivityComment {
  id: string;
  user: ServerUser;
  comment: string;
  dateTimeCreated: string;
  dateTimeEdited: string;
  commentLikeUsers: ServerUser[];
  numberOfResponses: number;
}

export interface ServerActivityCommentResponse {
  id: string;
  commentResponseLikes: ServerUser[];
  comment: string;
  parentActivityCommentId: string;
  user: ServerUser;
}

export interface ServerActivityLikes {
  likes: number;
  users: ServerUser[];
}

export interface ServerActivityRaiting {
  raiting: number;
  users: ServerActivityUserRaiting[];
}

export interface ServerActivityUserRaiting {
  id: string;
  email: string;
  name: string;
  rate: number;
  coverImageExtension: string | null;
}

// Visitor following host
export interface ServerUsersRelationActivity {
  userHostId: string;
  userVisitorId: string;
  name: string;
  countFollowing: number;
  countFollows: number;
  numberOfActivities: number;
  isVisitorFollowingHost: boolean;
  coverImageExtension: string | null;
}

// Search Input
export interface ServerSearchInput {
  id: string;
  userInput: string;
  isVisited: boolean;
}

// Notify Message
export interface NotifyMessage {
  id: string;
  user: ServerUser;
  observableUsersIds: string[];
  message: string;
  time: string;
}
