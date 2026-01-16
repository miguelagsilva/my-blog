---
title: My Homelab Setup
date: 2026-01-14
tags:
  - Homelab
  - Networking
  - Hardware
excerpt: A deep dive into my current homelab setup including OS, software, VM's, containers, Router/Firewall, IDS, remote access and hardware.
author: Miguel Silva
image: /images/posts/hp-proliant-closed.jpg
---

Building a homelab is a rewarding way to learn about IT, system administration, software, operating systems, problem-solving, networking, and cybersecurity. By adopting a hands-on approach to learning through continuously improving a homelab, it is a sure way to be ready for more complex tasks ahead and get to know many technologies and areas.

## My Goals

The first step to any engineering project, or project for that matter, is to have a set of goals and some understanding of how to accomplish said goals.

- **Learn**
- **Deploy useful applications**

## The first attempt at homelabbing

I started by opening up an old laptop that I had laying around and replaced the sshd for a spare ssd for faster reads/writes. I installed Ubuntu 24.04LTS with VMWare Workstation in which I could add VMs booted from ISO’s with snapshots. This quickly showed the weakness of running laptop hardware, the lack of CPU cores, memory, storage, reliability, and management/monitoring tools.

![My first homelab machine. A Qosmio Toshiba Laptop with its disk swapped.](/images/posts/toshiba-open.jpg)

## Getting Entreprise Server Hardware

I managed to get my hands on an HP Proliant Ml350p with base specifications, in which I installed Proxmox. A hypervisor built on top of Debian linux it supports KVM and LXC virtualization, incremental backups, web-based management, live migration, high availabilty, software-defined networking, and most importantly, is open-source.

![HP Proliant Ml350p Server with the side panel off.](/images/posts/hp-proliant-first.jpg)

I started by adding a few VMs/ LXC containers:
* **[Jellyfin](https://jellyfin.org/)** – Media management open source application
* **[WireGuard](https://www.wireguard.com/)** – VPN for remote access behind OPNSense
* **[Ollama](https://ollama.com/)** + **[Open WebUI](https://openwebui.com/)** – Local LLMs with a ChatGPT-like UI
* **[Changedetection.io](https://changedetection.io/)** – Website change monitoring software with notifications
* **[OPNSense](https://opnsense.org/)** – Router/firewall that sits after the LAN NIC and before all VMs
* **[Ubuntu Desktop](https://ubuntu.com/desktop)** – Accessed through VNC for initial OPNSense setup
* **[Nextcloud](https://nextcloud.com/)** – Self hosted cloud with file hosting and many cloud capabilities
* **[Security Onion](https://securityonion.net/)** – Threat hunting, security monitoring and log management

I want to highlight the OPNSense that acts as an intermediate step between the physical NIC and the virtual NIC that the VMs connect to. It also provides VPN software built into the UI for remote access or even full tunnel connection (allowing connection to the internet through the tunnel), allows custom DNS rules to have URLs such as jellyfin.lan redirect to the jellyfin IP address. A big plus of having OPNSense or its older cousin, PfSense, is to have full control over subnets, interfaces, VLANs, firewall rules, logging, and [more here](https://opnsense.org/). 

Ollama/Open WebUI are open source projects, like all the other software I am using, that allows the user to run local LLMs such as Qwen, GPT oss, Deepseek, Mistral, Gemini, and many more. I have been able to run abliterated models, meaning models that had their limitations removed for educational research. This allowed me much more easily learn about cybersecurity for CTFs or even out of curiosity without the hassle of explaining my non malicious intent.

Nextcloud acts as a personal/enterprise open source cloud that can be ran on premise with a huge library of apps that allow file management, Office-like online editors, pdf viewers, backups, and much more.

All of these services where deployed through Docker Compose through the official docker images, this allows easy orchestration of many containers; a single YAML file is the source of truth to the deployed services.
![Proxmox UI With all the VMs and LXCs.](/images/posts/proxmox-ui.png)

## Network Setup

An important part of setting up a homelab is getting the network done right. It should not be something I battle with everytime I want to get communication to outside of a VM, it should ensure be set up safely, and it should be reliable and available. My goal is to respect the CIA (Confidentiality, Integrity, Availability) Triad to have secure, reliable, and protected systems. There will be many changes to the network. This is a diagram of the current network.


## Hardware Upgrades

While deploying all of these services, I quickly ran into hardware limits, so I did a few cheap upgrades:
- 64GB DDR3 ECC RAM (used from eBay)
- NVIDIA GTX 1060 6GB (inserted into PCIE slot 16x powered through a power cable, 10-6pin cable from eBay)
- Desktop 1TB SSHD (unused disk I had lying around, not optimal due to no RAID capabilities and improvised zip tying)

I added power to the server through a UPS to protect the server from power fluctuations and allow it to gracefully shut down even in the case of a sudden power loss. This prevents data loss or hardware damage.

A very important upgrade was adding the graphics card, which showed great improvements in performance (1500%+) of models such as DeepseekR1 8B, Qwen3 8B, with prompt generation times dropping from a few minutes to a few seconds. It also stopped the VM from hogging all the vCPU and RAM it had assigned.

![Upgraded Server with more RAM, a graphics card and an extra disk.](/images/posts/hp-proliant-upgraded.jpg)
## Lessons Learned

There were many hurdles and steps in this process that I didn’t write about in this post. Building this homelab was a great hands-on experience that allowed me to learn about many areas of IT through trying it out.
The important part is that this lays the base for advanced learning in HA clusters, ZFS, Ceph, Monitoring, Cybersecurity labs with honeypots and IDS/IPS systems.