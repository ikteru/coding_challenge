#Using node argon as a parent image
FROM node:argon
#Set the working directory to /client
RUN mkdir /client
WORKDIR /client
#Copy the package.json file into the /client directory
COPY package*.json /client/
#Install dependencies
RUN npm install
#Copy the current directory contents into the container at /client
COPY . /client/
#Expose the 3000 port to the outside of the container
EXPOSE 3000
#Run the app when the container launches
CMD ["npm", "start"]
