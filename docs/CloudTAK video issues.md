**CloudTAK and Video from UAS Tool Challenges — 11/17/25**

Below is an update on the current video-streaming issue affecting integrations with certain UAS video sources.

The core challenge is that the UAS software outputs video using double-wrapped transport streams—essentially an RTSP stream nested inside another RTSP stream before reaching the actual video packets. While this structure is fairly common in commercial and professional live-video systems, our video management server, MediaMTX, does not currently support parsing this type of stream.

Because CloudTAK must remux incoming RTSP video into HLS for browser playback, the system is unable to process both layers of the transport stream, which prevents these UAS video feeds from being played directly in the web interface.

Our team has submitted feature requests to MediaMTX and even offered to sponsor development to add support for this configuration. So far, there has been no progress, but efforts are ongoing. At this time, we do not have an estimated timeline for when these video streams will be directly supported in CloudTAK.

**Workarounds**

Until the underlying issue is resolved, several temporary options are available:

1. Use a local player (e.g., VLC):  
   CloudTAK provides output stream links in multiple formats from the video-lease setup interface. When the feed is live, you can open these links in VLC and view the video alongside any other tools you need.  
2. Use a native TAK client on Windows:  
   The standalone Windows TAK client can natively play RTSP video and properly handles the double transport stream format. This allows viewing both the video and TAK map data within a single application.  
3. Screen-mirror a mobile TAK client:  
   You can mirror an Android or iOS device running TAK to a larger monitor. This provides combined access to video and map data through the mobile client.

