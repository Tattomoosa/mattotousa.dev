+++
title="EPA-RIMM"
weight=11
[taxonomies]
language=["Python", "C"]
[extra]
lead="Cutting-edge server security research"
+++

EPA-RIMM, or "Extensible Performance Aware Runtime Integrity Measurement Mechanism",
is "A Framework for Dynamic SMM-based Runtime Integrity Measurement" for x86 CPUs or,
in layman's terms, checking a system/hypervisor during runtime for any unexpected changes
in order to detect persistent threats (like rootkits) early. It relies on SSM
(System Management Mode), a feature of x86 CPUs that suspends all normal execution
including the OS.

Previous work utilizing SMM in runtime integrity checking had high performance
costs to the system, EPA-RIMM's primary innovation is dividing long-running
checks into much smaller tasks.

I worked on EPA-RIMM as a Master's project for one term mostly centered around
writing a test suite and fixing any bugs those tests found.
I also handled converting Python sections of the codebase from Python 2 to 3,
which was mostly automatic with `2to3` but required some manual effort.
My work was mostly confined to the Python "communication layers", but debugging
processes involved poking around in the C code from time to time.

## Papers

EPA-RIMM has been the subject of a couple published papers, all dating before my
contribution, but also all still relevant to the goals of the project today.

[EPA-RIMM: A Framework for Dynamic SMM-based Runtime Integrity Measurement (2018)](https://arxiv.org/abs/1805.03755)
[EPA-RIMM : An Efficient, Performance-Aware Runtime Integrity Measurement Mechanism for Modern Server Platforms (2019)](https://ieeexplore.ieee.org/document/8809524)
