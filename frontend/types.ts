export interface Class {
    id: string;
    value: string;
    label: string;
}

export interface SubscriptionPayload {
    name: string;
    whatsapp_number: string;
    subscribed_classes: string[];
}