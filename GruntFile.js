module.exports = function(grunt) {

  grunt.initConfig({
      handlebars: {
          build: {
              files: {
                  'src/core/templates.handlebars.js': ['src/templates/*.hb','src/templates/*.hbs']
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
                src: ['src/core/templates.handlebars.js'],
                dest: 'src/core/templates.handlebars.js',
                options: {
                  processTemplates: false
                },

              replacements: [
                {
                      from: 'this["Mura"] = this["Mura"] || {};',
                      to: function () {
                        return 'this["Mura"]=require("core/core");';
                      }
                },
                {
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
