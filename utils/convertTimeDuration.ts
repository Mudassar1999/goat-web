export const convertTimeDuration = (durationInSeconds: number) => {
     const hours = Math.floor(durationInSeconds / 3600);
     const minutes = Math.floor((durationInSeconds % 3600) / 60);
     const seconds = durationInSeconds % 60;

     return `${hours}h  ${minutes}m `;
};