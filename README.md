# Performance-Testing2

Sample performance test of http://159.89.38.11/login website

Username: test@orangetoolz.com

Password: 8Kh8nTe*^jdk

Performance Test Report(See Live)

Importent Note

What is JMeter?

-Performance test application

-Build using Java

-Free & Open Source

-Recording

-CLI

-Reports

Step of create Jmeter Test

1.Start JMeter

2.Create a TestPlan

3.Create a Thread Group (Users)

4.Add a Sampler (Http)

5.Add Listeners

6.Run the Test

JMeter Listener is a component that shows the results of the samples. The results can be shown in a tree, tables, graphs or simply written to a log file. Listeners provide pictorial representation of data gathered by JMeter about those test cases as a sampler component of JMeter is executed. Few most used listener

1.View Results in Table

2.View Results Tree

3.Aggregate Report

4.Graph Results

5.Summary Report

6.Simple Data Writer

JMeter Assertions are the component of a test that allow a user to validate that the response JMeter receives matches expected criteria. Few most used assertions

1.Response Assertion

2.Duration Assertion

3.Size Assertion

4.HTML Assertion

5.XML JSON Assertion

6.XPATH Assertion

Few most used JMeter Config Elements

1.User Defined Variables

2.HTTP Authorization Manager

3.HTTP Cache Manager

4.HTTP Cookie Manager

5.Login Config Element

6.CSV Data Set Config

7.FTP Request Defaults

8.HTTP Request Defaults

9.HTTP Header Manager

Run JMeter test from command line

-Open CMD

Command for result

jmeter -n -t "..\test_file.jmx" -l "..\result_file"

Command for result & report

jmeter -n -t "..\test_file.jmx" -l "..\result_file" -e -o "..\report_folder"

Command for report from an existing result file

jmeter -g "..\result_file" -o "..\report_folder"
