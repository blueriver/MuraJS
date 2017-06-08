module.exports = function(grunt) {

  grunt.initConfig({
      handlebars: {
          build: {
              files: {
                  'src/templates.js': ['src/templates/*.hb','src/templates/*.hbs']
              },
              options: {
                   namespace: 'Mura.templates',
                   processName: function(filePath) {
                    var name=filePath.split('/');
                    name=name[name.length-1];
                    name=name.split('.');
                    return name[0].toLowerCase();
                    }
              }
          }
      },
      replace: {
        build: {
                src: ['src/templates.js'],
                dest: 'src/templates.js',
                options: {
                  processTemplates: false
                },
                replacements: [{
                      from: 'Handlebars',
                      to: function () {
                        return "this.Mura.Handlebars";
                      }
                }]
            }
        }
  });

  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.registerTask('default',['handlebars:build','replace:build']);


};
