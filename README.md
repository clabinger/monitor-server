# monitor-server
Contact my development server and email me if it is running (in case I forgot to shut it down when not in use)

I use a Google Compute Engine instance for development purposes. If I shut it down when I'm not using it, I won't get 
charged for it during that time. 

I originally tried to use ping, but Google Cloud Platform responds to ping requests even if a server is powered down. Instead, this script uses cURL and examines the error string to determine if a server is powered on.

