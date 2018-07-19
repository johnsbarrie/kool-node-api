 ## STATE OF THESE DOCUMENTS

### POSTMAN
The postman file contains several api example calls.

### RIGHTS AND PERMISSIONS
The role_rights file contains two list of the types of member and the permissions.

 ### REDUNDANT END POINT  
 
 Some endpoints (such as Members)may not be necessary and some errors messages maybe missing.


 ### FILM ENCODING

We are be missing the film encoding script, how to queue this script action and how to access the films after the encodage. The shot will be added to the encoding queue, if the timeline has been updated. 

We should have a table '''ENCODING_QUEUE''', which contains the :shot_id the :date_of_the_last_updated_timeline and the :date_last_completed encoding.

The script will look something like this.

```#!/usr/bin/ruby
require 'FileUtils'
require 'rexml/document'
require 'pathname'
include REXML

shotName="cats"
projectPath="/Volumes/GoogleDrive/My\ Drive/KOOL/KoolKyan/data/project_kc"
frameRate=12.5

Dir.chdir("#{projectPath}/shots/#{shotName}") do
  outputFilm="#{shotName}.mp4"
  frameDuration=1/frameRate
  sequenceFileName = "sequence.txt"
  xmldoc = Document.new(File.new("shot.xml"))
  sequencetxt = "sequence.txt"
  File.open(sequenceFileName, "w") { |f| 
    xmldoc.elements.each("shot/timeline/layers/layer/image") { |element| 
      f.puts "file #{File.join(".", 'png', "view#{element.attributes['id']}.png")}"
      f.puts "duration #{frameDuration}" 
    }
  }
  cmd = <<-FOO 
    ffmpeg -f concat -safe 0 -i #{sequenceFileName} -c:v libx264 -pix_fmt yuv420p -crf 23 -r 25  -y #{outputFilm}
  FOO

  `#{cmd}`
  FileUtils.rm(sequenceFileName)
end
```






