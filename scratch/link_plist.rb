require 'xcodeproj'
project_path = 'ios/FirebaseLiveChatApp.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Find the main target
target = project.targets.find { |t| t.name == 'FirebaseLiveChatApp' }
group = project.main_group.find_subpath('FirebaseLiveChatApp', true)

file_name = 'GoogleService-Info.plist'
file_path = "FirebaseLiveChatApp/#{file_name}"

# Check if file is already in project
file_ref = group.files.find { |f| f.path == file_name }

if file_ref
  puts "File already in project, ensuring it's in the target..."
else
  puts "Adding file to project..."
  file_ref = group.new_reference(file_name)
end

# Add to build phase if not already there
unless target.resources_build_phase.files_references.include?(file_ref)
  target.add_resources([file_ref])
  puts "Added to Resources Build Phase."
else
  puts "Already in Resources Build Phase."
end

project.save
puts "Successfully saved project."
