Turn by turn strategy game, improvised version of Tic Tac Toe 

GitHub Repository: https://github.com/DomainFlag/MoonriseKingdom

The database config is situated in `/inc` folder where the database is configured
for Web Server, there are notes how to set up for a localhost environment.

There is a .htaccess that automatically redirects by changing the absolute path of root
you put => to the `views/` folder.

**Database**: E/A Diagram and Relational Database can be found in `database` folder (!note 
that there is a thing that differs in Relational DB in comparison with E/A one => the 
Contains relation that links Team and Game should be a stand alone table but because 
we implemented at first not thinking about the victory_team_id we put 1 foreign key in 
Team table that point to the Game id where there will be always 2 teams for one game, 
so basically, there is always 2 teams that have the same game_id. To fix the victory_team_id
thing, we went by changing Game table having a foreign key to the team_id => in other words
fix stuff with tape :p). 


!!! -> NOTE: there are used sessions, so to play another game then the game you are currently in
you'll have to clear cookies(starting bdw* if on Web Server | localhost* if on localhost)


It's is highly advisable to use the localhost environment because of its speed, and latest php
version >= 7.0, one of the problems of using the Web Server is that there are manny assets
like fonts and especially images that are in very high resolution => it will take time for me to 
downgrade a little bit, so there are cases were images like board.png that takes 
20000ms to fetch(thanks god there is waterfall technology) so if your internet speed is low 
but still want to try on Web Server => Patience because the time fixes everything :)

If there any questions regarding the code and the decisions behind them => I'm opened to answer any questions =>
Cchivriga@hotmail.com