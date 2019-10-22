using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace WebService
{
    public class Startup
    {
        public static LoggingFramework.ILog _iLog = null;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;


            //create global logger.            
            //string LogFilePath = ConfigurationManager.AppSettings["LogPath"] + "\\WebServiceAPILog.txt";
            string LogFilePath = Path.Join(Configuration["LogPath"], "WebServiceAPILog.txt");
            bool useBufferedLog = false;
            bool enableDebugLog = false;
            try
            {
                //useBufferedLog = Convert.ToBoolean(ConfigurationManager.AppSettings["UseBufferedLog"].ToString());
                useBufferedLog = Convert.ToBoolean(Configuration["UseBufferedLog"].ToString());
            }
            catch (Exception exception)
            {
                useBufferedLog = false;
            }
            
            try
            {
                //EnableLog = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableLog"].ToString());
                enableDebugLog = Convert.ToBoolean(Configuration["EnableDebugLog"].ToString());
            }
            catch (Exception exception)
            {
                enableDebugLog = false;
            }

            
            if (useBufferedLog)
            {
                _iLog = new LoggingFramework.BufferedFileLog(LogFilePath, true, enableDebugLog);
            }
            else
            {
                _iLog = new LoggingFramework.FileLog(LogFilePath, true, enableDebugLog);
            }
            _iLog.WriteTrace("Webservice API global logger created on Application Start.");
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });


            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
