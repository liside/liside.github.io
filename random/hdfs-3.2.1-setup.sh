#!/bin/sh
sudo apt update -y
sudo apt install openjdk-8-jdk -y
wget https://downloads.apache.org/hadoop/common/hadoop-3.2.1/hadoop-3.2.1.tar.gz
tar xvf hadoop-3.2.1.tar.gz
sudo mv hadoop-3.2.1 /usr/local/hadoop
sudo rm hadoop-3.2.1.tar.gz
# sudo adduser -q --gecos "" hdoop
# sudo adduser --disabled-password -q --gecos "" hdoop
sudo chown -R hdoop /usr/local/hadoop

# sudo su - hdoop
# echo "$USER"
# ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
# cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
# chmod 0600 ~/.ssh/authorized_keys
sudo mkdir /home/hdoop/.ssh
sudo touch /home/hdoop/.ssh/authorized_keys
sudo sh -c 'echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDdNHGoNC99dZMPXyD4huFPv0r7r9ujeJC6qe+hSIhnGNbrFbHJDizj1MZ8dOsLTxI2W9AHiCqPD6cisWNJ/+WglcjYTz3qh84OKNCUrGNrJlYSqP75EF+0z5EdaNOCxQAaHNk2Nti8d8EanFz1uCAtpnSDxqlVliCpBurVhhQ/VqW3XCOoAwUklw9UtuhVCpr7FLua4I6o12AOfRMCdWf/ydpkPLjjZ7hVpeanxQzR+GN9YClvJe+0irhKfP1s9rsIDcfeLEpwldh44+8twlT8QRGLJIbPlqR8KfcT70vMHQFJyrvKE8HESFHI7uie9Fuc9zWSmZN0zP68TF+TYOzb hdoop@namenode.gl-2021.orion-pg0.clemson.cloudlab.us" >> /home/hdoop/.ssh/authorized_keys'

sudo cp /usr/local/hadoop/share/hadoop/tools/lib/aws-java-sdk-bundle-1.11.375.jar /usr/local/hadoop/share/hadoop/common/lib/
sudo cp /usr/local/hadoop/share/hadoop/tools/lib/hadoop-aws-3.2.1.jar /usr/local/hadoop/share/hadoop/common/lib/
echo "export PATH=$PATH:/usr/local/hadoop/bin/" >> /users/liside/.bashrc
echo "export HADOOP_USER_NAME=hdfs" >> /users/liside/.bashrc
sudo sh -c 'echo "export PATH=$PATH:/usr/local/hadoop/bin/" >> /home/hdoop/.bashrc'
sudo sh -c 'echo "export HADOOP_USER_NAME=hdfs" >> /home/hdoop/.bashrc'
source .bashrc

if test -b /dev/sdb && ! grep -q /dev/sdb /etc/fstab; then
    sudo mke2fs -F -j /dev/sdb
    sudo mount /dev/sdb /mnt
    sudo chmod 777 -R /mnt
    sudo sh -c 'echo "/dev/sdb	/mnt	ext3	defaults	0	0" >> /etc/fstab'
fi

sudo mkdir /mnt2
sudo chmod 777 -R /mnt2
sudo mke2fs -F -j /dev/sda4
sudo mount /dev/sda4 /mnt2
sudo mkdir /mnt2/tmp
sudo chmod 777 -R /mnt2/tmp

sudo mkdir /mnt/hadoop
sudo chmod 777 -R /mnt/hadoop
sudo chown -R hdoop /mnt/hadoop


sudo chmod 666 /usr/local/hadoop/etc/hadoop/core-site.xml
sudo chmod 666 /usr/local/hadoop/etc/hadoop/hdfs-site.xml
sudo chmod 666 /usr/local/hadoop/etc/hadoop/yarn-site.xml
sudo chmod 666 /usr/local/hadoop/etc/hadoop/mapred-site.xml
sudo chmod 666 /usr/local/hadoop/etc/hadoop/hadoop-env.sh
if ! grep -q fs.defaultFS /usr/local/hadoop/etc/hadoop/core-site.xml; then
sudo cat > /usr/local/hadoop/etc/hadoop/core-site.xml <<EOF
<configuration>
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://namenode:9000/</value>
  </property>
</configuration>
EOF
fi

# grep -o -E 'slave[0-9]+$' /etc/hosts > /usr/local/hadoop/etc/hadoop/slaves
sudo sh -c 'grep -o -E "slave[0-9]+$" /etc/hosts > /usr/local/hadoop/etc/hadoop/slaves'
if ! grep -q dfs.namenode.name.dir /usr/local/hadoop/etc/hadoop/hdfs-site.xml; then
sudo cat > /usr/local/hadoop/etc/hadoop/hdfs-site.xml <<EOF
<configuration>
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>/mnt/hadoop</value>
  </property>
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>/mnt/hadoop</value>
  </property>
</configuration>
EOF
fi

if ! grep -q yarn.resourcemanager.hostname /usr/local/hadoop/etc/hadoop/yarn-site.xml; then
sudo cat > /usr/local/hadoop/etc/hadoop/yarn-site.xml <<EOF
<configuration>
  <property>
    <name>yarn.resourcemanager.hostname</name>
    <value>resourcemanager</value>
  </property>
  <property>
    <name>yarn.resourcemanager.webapp.address</name>
    <value>0.0.0.0:8088</value>
  </property>
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
  </property>
</configuration>
EOF
fi

if ! grep -q mapreduce.framework.name /usr/local/hadoop/etc/hadoop/mapred-site.xml; then
sudo cat > /usr/local/hadoop/etc/hadoop/mapred-site.xml <<EOF
<configuration>
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
  </property>
  <property>
    <name>mapreduce.jobhistory.webapp.address</name>
    <value>0.0.0.0:19888</value>
  </property>
  <property>
    <name>yarn.app.mapreduce.am.env</name>
    <value>HADOOP_MAPRED_HOME=/usr/local/hadoop</value>
  </property>
  <property>
    <name>mapreduce.map.env</name>
    <value>HADOOP_MAPRED_HOME=/usr/local/hadoop</value>
  </property>
  <property>
    <name>mapreduce.reduce.env</name>
    <value>HADOOP_MAPRED_HOME=/usr/local/hadoop</value>
  </property>
</configuration>
EOF
fi

# sed -i orig -e 's@^export JAVA_HOME.*@export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64@' -e 's@^export HADOOP_CONF_DIR.*@export HADOOP_CONF_DIR=/usr/local/hadoop/etc/hadoop@' /usr/local/hadoop/etc/hadoop/hadoop-env.sh
sudo echo "export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64" > /usr/local/hadoop/etc/hadoop/hadoop-env.sh
sudo echo "export HADOOP_CONF_DIR=/usr/local/hadoop/etc/hadoop" >> /usr/local/hadoop/etc/hadoop/hadoop-env.sh

# if hostname | grep -q namenode; then
#     if ! test -d /mnt/hadoop/current; then
#       sudo /usr/local/hadoop/bin/hadoop namenode -format
#     fi
#     sudo /usr/local/hadoop/sbin/hadoop-daemon.sh start namenode
#     sudo /usr/local/hadoop/sbin/yarn-daemon.sh start resourcemanager
# else
#     sudo /usr/local/hadoop/sbin/yarn-daemon.sh start nodemanager
#     sudo /usr/local/hadoop/sbin/hadoop-daemon.sh start datanode
# fi

# if hostname | grep -q namenode; then
#     sudo /usr/local/hadoop/bin/hdfs dfs -mkdir /user
#     sudo /usr/local/hadoop/bin/hdfs dfs -mkdir /tmp
#     sudo /usr/local/hadoop/bin/hdfs dfs -mkdir /tmp/hadoop-yarn
#     sudo /usr/local/hadoop/bin/hdfs dfs -mkdir /tmp/hadoop-yarn/staging
#     sudo /usr/local/hadoop/bin/hdfs dfs -chmod 1777 /tmp
#     sudo /usr/local/hadoop/bin/hdfs dfs -chmod 1777 /tmp/hadoop-yarn
#     sudo /usr/local/hadoop/bin/hdfs dfs -chmod 1777 /tmp/hadoop-yarn/staging
# fi

