export interface ChatComment {
    id: number;
    body: string;
    userName: string;
    createdAt: Date;
    displayName: string;
    image: string;

}

export interface CommentFormValues {
    activityId: string;
    body: string;
}