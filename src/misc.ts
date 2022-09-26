export enum HTTPStatusCode {
    OK = 200,
    CREATED = 201,
    REDIRECT = 302,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
}

const users: IRoom[] = [];

interface IRoom {
    id: string;
    name: string;
    room: string;
}

const addUser = ({ id, name, room }: IRoom) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find(
        (user) => user.room === room && user.name === name
    );

    if (!name || !room) return { error: "Username and room are required." };
    if (existingUser) return { error: "Username is taken." };

    const user = { id, name, room };

    users.push(user);

    return { user };
};

const removeUser = (id: string) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id: string) => users.find((user) => user.id === id);

const getUsersInRoom = (room: string) =>
    users.filter((user) => user.room === room);

export { addUser, removeUser, getUser, getUsersInRoom };
