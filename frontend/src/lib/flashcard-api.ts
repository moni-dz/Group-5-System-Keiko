export interface Flashcard {
    id: string | "";
    question: string;
    answer: string;
    difficulty: string;
    tags: string;
    created_at: string | "";
    updated_at: string | "";
}

export async function getAllCards() {
    return fetch("http://localhost:8080/api/v1/cards")
        .then((r) => r.json())
        .then((data: Flashcard[]) => data);
}

export async function getCard(id: string) {
    return fetch(`http://localhost:8080/api/v1/cards/${id}`)
        .then((r) => r.json())
        .then((data: Flashcard) => data);
}

export async function addCard(card: Flashcard) {
    return fetch(`http://localhost:8080/api/v1/cards`, {
        method: "POST",
        body: JSON.stringify({
            question: card.question,
            answer: card.answer,
            difficulty: card.difficulty,
            tags: card.tags,
        }),
        headers: { "Content-Type": "application/json; charset=UTF-8" },
    })
        .then((r) => r.json())
        .then((data: Flashcard) => data);
}

export async function updateCard(card: Flashcard) {
    return fetch(`http://localhost:8080/api/v1/cards`, {
        method: "PUT",
        body: JSON.stringify({
            id: card.id,
            question: card.question,
            answer: card.answer,
            difficulty: card.difficulty,
            tags: card.tags,
        }),
        headers: { "Content-Type": "application/json; charset=UTF-8" },
    })
        .then((r) => r.json())
        .then((data: Flashcard) => data);
}

export async function deleteCard(id: string) {
    return fetch(`http://localhost:8080/api/v1/cards/${id}`, { method: "DELETE" })
        .then((r) => r.json())
        .then((data: Flashcard) => data);
}
