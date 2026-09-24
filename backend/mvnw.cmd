@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.2.0
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a key stroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@IF "%MAVEN_BATCH_ECHO%"=="on" echo %MAVEN_BATCH_ECHO%

@REM set %HOME% to equivalent of $HOME
@IF "%HOME%"=="" (SET "HOME=%HOMEDRIVE%%HOMEPATH%")

@REM Execute a user defined script before this one
@IF NOT "%MAVEN_SKIP_RC%"=="" GOTO skipRcPre
@IF EXIST "%USERPROFILE%\mavenrc_pre.cmd" CALL "%USERPROFILE%\mavenrc_pre.cmd" %*
:skipRcPre

@setlocal

@SET MAVEN_PROJECT_BASEDIR=%~dp0
@SET MAVEN_WRAPPER_PROPERTIES_FILE=%MAVEN_PROJECT_BASEDIR%.mvn\wrapper\maven-wrapper.properties
@SET DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip

@SET WRAPPER_JAR=%MAVEN_PROJECT_BASEDIR%.mvn\wrapper\maven-wrapper.jar

@SET JAVA_EXEC=%JAVA_HOME%\bin\java.exe
@IF NOT EXIST "%JAVA_EXEC%" SET JAVA_EXEC=java

@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@SET MAVEN_WRAPPER_JAR=%WRAPPER_JAR%

%JAVA_EXEC% -cp %MAVEN_WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECT_BASEDIR%" %WRAPPER_LAUNCHER% %* 2>&1

@REM Exit code from the java command
@SET ERRORLEVEL_VALUE=%ERRORLEVEL%

@endlocal & SET RETURN_CODE=%ERRORLEVEL_VALUE%
@EXIT /B %RETURN_CODE%
