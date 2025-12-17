**Intro**

Welcome to COTAK. In this tutorial we will walk you through the core functionalities of ATAK, the Android version of the Team Awareness Kit. If you have not performed the initial setup of ATAK, including connecting to the COTAK server, click the banner in the top right, or navigate to COTAK.gov and search for the ATAK getting started tutorial.

**Basic Features**

When you open the iTAK app you see a basemap with a variety of icons that show your location and the locations of other first responders. Your location is shown as a blue pointer arrow, which points the direction that your device’s compass indicates. Other TAK app users are shown as multi-color dots, with the color of the dot controlled by the user’s team color. COTAK uses a standard to indicate what type of first responder a dot color corresponds to. Refer to COTAK guidance on this standard.

Dots show the last reported GPS location of other first responders, which ranges from near real-time up to approximately 10 minutes old. A dot with a slash through it indicates that a user is still running the TAK app, but has lost GPS reception. These dots with slash marks indicate the last known location of the responder but may be several minutes old, and should be treated with caution as the responder may have moved in the meantime.

Any dot including your own can be tapped on to receive more information on the item, or access the tools. Note that when tapping on a dot the callsign for the dot appears on the map, as well as the \- coordinates, elevation, GPS error, speed and direction. This same information is always available for yourself across the bottom of the screen.

A wheel of options also appears on a dot when tapped on. Starting at the 3 o'clock position going clockwise is the breadcrumb tool, which when tapped causes the user to leave a trail of breadcrumbs behind them as they move about the map.  
Next is the details page, where you can view additional data on the item, including when applicable the version of TAK used by the user, their battery life, and the time their location was last  updated. By swiping you can also view the user’s coordinates and their distance and bearing from you. 

Next is the trash can which will delete the marker from your map and your map only. For markers that correspond with TAK app users or vehicles in motion, a deleted marker will reappear on your map when their location is next updated.

Next is the polar coordinate entry tool which is generally relevant for military operations. Then the four arrows are the fine adjustment tool for the marker if you need to manually adjust the placement of a marker. The two-ended arrow incorporates a measuring tool from the marker to a location you designate.

Next you can lock on this marker, meaning the map will stay centered on this item. Note the padlock turns yellow in the upper left to designate that this feature is active. You will almost always use this to lock on yourself (while in motion) or on another user in motion. To unlock the map tap again on the yellow lock icon.

**Adding map markers**

There are two common ways to add a map marker, one is with the point dropper tool in the top menu bar, or with the go to selection in the drop down menu.

When using the point dropper you can select from ATAK’s standard 4 icons, or scroll and find many more options. Most of the time one of these four is fine. Each marker type may have slightly different options within its own radial menu, notably the red diamond or hostile marker. You may experiment with each later to see what fits your needs. You must select a marker type before adding it to the map. 

While you are in the point dropper tool, every place you touch you will add a point. To stop adding points, click the back button on the Android screen. Then, click it again to remove the menu from your display.

Click on the yellow marker. Starting at the 3 o'clock position going clockwise is the breadcrumb tool, this is irrelevant for a stationary point but will become more important if this icon is ever used for a mobile unit. 

Next is the details page, here you can change the name of the point, its coordinates (which will subsequently move the dot), or send the point to another TAK user. Note that the default formatting is the marker was created by type, here U for unknown, then the day of the month and the local time. Thus U.14.130042 means Unknown, 14th of the month at exactly 1300 hours and 42 seconds. You can change this to something more meaningful. 

Also within the details view is the send button, you can share this point directly with other TAK users. Select send, and check the boxes next to the users you want to share the point with. Then click send to execute that function. You can use the broadcast button as well, but we suggest forming the habit of designating your recipients so you do not clutter the map view of everyone on your channel – unless they need to see it.

Next is the trash can which will delete the marker from your map and your map only. There is one exception,  if your agency is using the advanced datasync feature and all users are subscribed then any change you make will impact users once they sync with the data feed. 

Next is the polar coordinate entry tool which is generally relevant for military operations. Then the four arrows are the fine adjustment tool for the marker if you need to be extremely precise. The two-ended arrow incorporates a measuring tool from the marker to a location you designate. If, after using the measuring tool, you click on the line, you will see some other options, the most likely to be used is the Range and bearing tool (R\&B). You can extend the line a specific distance and bearing. Perhaps useful in a triangulation type fashion common on paper maps with pencil and protractor. You can also trashcan this line.

Next you can lock on this marker, meaning the map will stay centered on this item. Note the padlock turns yellow in the upper left to designate that this feature is active. You will almost always use this to lock on yourself (while in motion) or on another user in motion.

You may also use the GoTo Globe button in the dropdown menu. You must select the format for coordinate entry, you may also search by address. It is important you select a marker type or, the map will pan to the location you input, however, no marker will appear. In this method you have just a few marker type choices.

After creating this marker the bloodhound tool is used to indicate a direct line from a selected user or location to another user or marker. Most of the time there will be a marker of interest and you want to know how far it is and the most direct route to arrival. The bloodhound tool does not account for routing around terrain, roads or trails. It is simply “As the crow flies”. Select the bloodhound tool, select from what you’d like to bloodhound, use the crosshairs to select a different starting point, and use the crosshairs to select a finishing point. Each end of the bloodhound must be a marker. Simply add a marker if one does not exist yet for where you need to go.

**Track History**

ATAK saves tracks on the device. Use the track history button in the dropdown menu to view these or to save for later viewing. There are several ways to search these but we’ll show the most straightforward method. Click the left arrow,scroll down to locate the track of interest. ATAK starts a new track every time the app is closed and reopened. If the track is older, you may attempt to search the server. However, due to data retention policies, all data is wiped from COTAK servers after 7 days. Retrieve important tracks immediately.   
Once you ding the track of interest click the export button (the paper with an arrow), name the track, click next and choose the file type you’d like. KML is commonly used in google earth. There are other options for specialized needs. Take note (or a screenshot) of the location to where the track file was stored. You may share it via email or other options as well. Find it in this folder atak/export/ within your file manager.

**Toolbar**

Across the top of the ATAK app is the toolbar, which contains tools used by the app. A standard set of tools is deployed when you connect ATAK to the COTAK Server for the first time, though the placement of these tools can be customized by you later.

Next we will cover the default tools used by COTAK from left to right, starting with the channels tool.

**Channels**

You will see a list of the channels that are available to your COTAK account. Tapping on the eyeball icon next to the channel turns it on, which shares your location with all other users on that same channel and enables you to interact with the users. Turning a channel off removes your location and presence from that channel. 

**Contacts Tool**

Within the contacts tool (the three people) you can see who is connected and using TAK. This can be useful for rostering or status of enroute units. Tapping on the callsign of a contact pans the map to center on that user’s location. Additionally, you can message your TAK contacts. While at first this doesn’t seem that useful, in a mutual aid scenario you can message directly to individuals you’ve never met before nor may even know their name apart from their callsign.

**Trifold Map**

The trifold map, like the old fold up paper maps, is used to access your streaming maps as well as any downloaded maps. Your agency may provide options to download but many users find it just as easy to download their own. Scrolling through the mobile maps is self-explanatory. To download maps to your device, which often makes it function faster and consumes less battery, select the map version you’d like to download and click the play button in the lower right corner.   
Click select area, the general shape you’d like to download and click the map to designate the boundaries. Start with a more “coarse” image as downloaded satellite imagery can be quite large. We recommend not finer than 5 meters. Most users will want to be on wifi before Clicking download, especially for large maps as this can take a while. This is not ATAK’s fault, but the sources limit how fast a map can be downloaded. Often this is something good to do when the device won’t be used for a few hours if you are downloading a large area. Click create a new tileset (unless you’re adding to an existing one) and name it.

Toggle the blue online button to “local”. You should see your offline map options here. When connectivity is poor or absent, use these maps for continuity of operation. Toggle the local button back to online. If you notice your streaming maps are lagging, consider using something like ESRI topo maps. Maps without imagery tend to be faster for downloading. 

**Point Dropper**

The point dropper tool is covered in detail in another video. This tool allows you to drop points and share them with other TAK app users.

**Bloodhound**  
The bloodhound tool is used to indicate a direct line from a selected user or location to another user or marker. Most of the time there will be a marker of interest and you want to know how far it is and the most direct route to arrival. The bloodhound tool does not account for routing around terrain, roads or trails. It is simply “As the crow flies”. Select the bloodhound tool, select from what you’d like to bloodhound, use the crosshairs to select a different starting point, and use the crosshairs to select a finishing point. Each end of the bloodhound must be a marker. Simply add a marker if one does not exist yet for where you need to go. To exit bloodhound mode simply tap on the bloodhound tool icon again. 

**Quitting the App**

ATAK turns on your device’s GPS when you start the app, which provides your location to the app and other first responders. This continues when you switch to another app and continue running ATAK in the background. To stop sharing your location entirely it is necessary to quit the ATAK app. To do this tap on the overflow tools icon, scroll to the bottom of the tools list, tap on the “Quit” option, and tap “yes” to confirm you would like to quit the app. Alternatively you may engage the Android app switcher, and swipe up on the ATAK app to quit it. 

**Conclusion**

This concludes the getting started tutorial for ATAK, powered by the Colorado Department of Public Safety and the Center of Excellence for Advanced Technology Aerial Firefighting. To learn more visit us at cotak.gov  
