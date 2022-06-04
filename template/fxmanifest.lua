
fx_version 'cerulean'
game 'gta5'

name "${scriptName}"
description "${description}"
author "Icon7"
version "0.0.1"

shared_scripts {
    'config.lua',
	'shared/*.lua'
}

client_scripts {
	'client/*.lua'
}

server_scripts {
	'server/*.lua'
}

dependencies {
	'srive_core',
}