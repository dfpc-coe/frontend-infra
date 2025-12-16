**Part 2: Enabling Livestream**   
Hello, and welcome to the Center of Excellence training series on TAK.  
This is part two of our two-part series on the UAS Tool.  
In this tutorial, we’ll cover how to enable full-motion video or FMV streaming through the COTAK Server.  
If you haven’t installed and set up the UAS Tool ATAK plugin, please refer to our Part 1 video on downloading and configuring UAS Tool. Some UAS platforms may come with an ATAK capability. In this case the configurations may differ slightly from the video, but the general concepts apply.

\[About the Media Server\]  
The COTAK team funds and manages a full-time media server for FMV streaming from drones.  
This allows any COTAK user on the same channel as the drone operator to view the real-time feed from the drone’s camera.  
To handle the large amount of data going through the server, we use a lease system.  
This system lets you quickly enable streaming for up to 16 hours, after which the lease turns off automatically, as there is a notable cost to the COTAK program to have this capability.   
This also reduces strain on the server while keeping FMV streaming available when needed.   
When a lease expires, you can renew it without changing the URL. It’s similar to turning on and off a light switch, and allows you to resume using the lease for up to another 16 hours.

\[Creating a Video Lease\]  
To start, open a web browser and go to map.cotak.gov.  
You can use any internet-enabled device, but I find the controller’s browser most convenient.  
You’ll be directed to the CloudTAK login page.  
CloudTAK is a versatile web-based TAK client, developed in-house by the COTAK Program Team.  
Log in with your COTAK credentials.  
If this is your first time using CloudTAK, you’ll be prompted to create your callsign identity, this is how your CloudTAK dot will appear on the map to others.  
Once you’ve done that, you’ll arrive at the main map screen.  
If you’d like to learn more about CloudTAK, refer to the CloudTAK Getting Started Tutorial.

\[Opening the Video Tool\]  
From the hamburger menu, select the Videos tool — it’s the one with the camera icon.  
Click the Video Leases tab.  
Tap the plus symbol.  
You’ll now see the New Lease popup.

\[Filling Out the Lease\]  
First, name your lease.  
This is how it will appear to you and other users.  
I’ll name mine: DFPC dash CoE dash M4T.  
Next, leave the duration at 16 hours — that’s the maximum, and it’s usually best.  
Remember, you can renew the lease later without reconfiguring the link. This will be a simple process after this setup is completed once.  
For Source Type, choose UAS-Rotor, fixed-wing, or whatever best applies to your platform.  
In the Source Model box, type your UAS model. This will help you reference in the future which platform this lease is for.  
Most of the COTAK users who need to see the video from your drone will simply click on the drone’s map icon and then a button to play the video. If you may be operating the drone where GPS is not available to generate that map icon (such as interior drones), or if you simply need another option for your users to access the video, you can select the “Publish to TAK Server” option, which adds a link to watch the video, to the TAK Server. Users can then access that link by opening the video tool in their TAK app and searching the TAK Server for available streams.  
Record Stream saves any video passed through the lease to CloudTAK for later viewing and downloading. This feature is in development as of summer 2025 and will be covered in a later video.

The Read/Write Security button adds a shared username and password to the video link, which adds an extra layer of security to the video stream.

Activating the ‘shared lease’ button allows you to search a list of your COTAK channels and associate the video lease you are creating with one of those channels. If you do this any other COTAK user with access to the same channel can log into CloudTAK to renew the lease or otherwise manage it. This can be useful if a single drone is shared amongst your department, and multiple pilots might need to renew the lease that has been loaded into the drone prior to flying it.   
Once done, press Save.

\[Your Lease is Ready\]  
Your lease is now created and ready to import into UAS Tool.  
You can edit or delete it in the top-right corner.  
You can also use the wizard in the bottom-right for help importing the Observer URL.

\[Configuring UAS Tool\]  
Open UAS Tool in ATAK.  
Then select the upper hamburger menu and scroll down to settings.  
Next, select Video Broadcast Preferences.  
Select Video Broadcast Destination and choose RTSP-Push.  
Then make sure the Use SSL box is unchecked.  
If the Observer URL Update box appears, always select Yes, Update.  
Go to Video Destination IP Address and enter: video dot cotak dot gov.  
Go to Video Destination Port and enter: eight five five four.  
Next, select Video Broadcast Identifier.  
Enter the string that comes after the port number and slash in your RTSP link.  
You can also copy this from step eight of the wizard.  
Select OK.  
Finally, check that Video Observer URL exactly matches the RTSP link in your lease.  
If ?TCP is at the end of your video observer URL, scroll up and disable reliable P2P connection.

\[Starting the Stream\]  
If everything matches, you’re ready to stream.  
Open UAS Tool and connect to your UAS.  
Tap the wrench icon in the bottom flight controls.  
On the left, select the Broadcast Button. If something has been entered incorrectly, you will likely see an error message within a few seconds of enabling the broadcast.  
Anyone on your channel can now click the drone icon and view your live stream.   
To do this in ATAK click the Drone CoT marker and select the play button at the top of the radial menu.  
In iTAK select the drone CoT marker, then select the three dots, and finally select Play Video.   
In either application you may make the video full screen or you may close the video player.

To renew your video lease, return to the video lease page in CloudTAK, click on the expired lease, and select renew. This is the only step "you", the user, will have to complete in order for you to use the video lease in the future. This can be done ahead of time, on your laptop or on the GCS browser, although you will need connectivity.

This concludes our ATAK tutorial on the UAS Tool, powered by the Colorado Department of Public Safety and the DFPC Center of Excellence for Advanced Technology Aerial Firefighting. Thanks for watching.